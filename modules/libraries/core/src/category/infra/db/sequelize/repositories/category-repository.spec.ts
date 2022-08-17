import { Category, CategoryRepository } from "#category/domain";
import { setupSequelize } from "#category/infra/testing/helpers/db";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { CategoryModel } from "../models";
import { CategorySequelizeRepository } from "./category-repository";
import _chance from "chance";
import { validate as uuidValidete } from "uuid";
import { CategoryModelMapper } from "../mappers";

describe("CategorySequelizeRepository", () => {
  let repository: CategorySequelizeRepository;
  let chance: Chance.Chance;

  setupSequelize({ models: [CategoryModel] });

  beforeAll(() => {
    chance = _chance();
  });

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should insert a new entity", async () => {
    let category = new Category({ name: "Movie" });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false,
    });
    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("invalid-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID invalid-id`)
    );

    await expect(
      repository.findById(
        new UniqueEntityId("745ea3de-c65e-4557-bfe7-b486d5693e4e")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID 745ea3de-c65e-4557-bfe7-b486d5693e4e`
      )
    );
  });

  it("should finds a entity by id", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    let enitityFound = await repository.findById(entity.id);
    expect(enitityFound.toJSON()).toStrictEqual(entity.toJSON());

    enitityFound = await repository.findById(entity.uniqueEntityId);
    expect(enitityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should return all categories", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it("should only apply paginate when other params are null", async () => {
    const toEntitySpy = jest.spyOn(CategoryModelMapper, "toEntity");
    const created_at = new Date();
    await CategoryModel.factory()
      .count(16)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: "Movie",
        description: null,
        is_active: true,
        created_at,
      }));

    const searchOutput = await repository.search(
      new CategoryRepository.SearchParams()
    );

    expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
    expect(searchOutput.toJSON()).toMatchObject({
      total: 16,
      current_page: 1,
      last_page: 2,
      per_page: 15,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    searchOutput.items.forEach((item) => {
      expect(item).toBeInstanceOf(Category);
      expect(uuidValidete(item.id)).toBeTruthy();
      expect(item.toJSON()).toMatchObject({
        name: "Movie",
        description: null,
        is_active: true,
        created_at,
      });
    });
    expect(toEntitySpy).toHaveBeenCalledTimes(searchOutput.items.length);
  });

  it("should oorder by creted_at DESC when search params are null", async () => {
    const created_at = new Date();
    await CategoryModel.factory()
      .count(16)
      .bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `Movie-${index}`,
        description: null,
        is_active: true,
        created_at: new Date(created_at.getTime() + index * 100),
      }));

    const searchOutput = await repository.search(
      new CategoryRepository.SearchParams()
    );

    const reversedItems = [...searchOutput.items].reverse();
    reversedItems.forEach((item, index) => {
      expect(item.name).toBe(`Movie-${index + 1}`);
    });
  });

  it("should apply paginate and filter", async () => {
    const defaultProps = {
      description: null,
      is_active: true,
      created_at: new Date(),
    };
    const categoriesProp = [
      { id: chance.guid({ version: 4 }), name: "test", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "TeSt", ...defaultProps },
    ];
    const categories = await CategoryModel.bulkCreate(categoriesProp);

    let expectedItems = [
      CategoryModelMapper.toEntity(categories[0]),
      CategoryModelMapper.toEntity(categories[2]),
    ];
    let expected = {
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
      sort: null as string | null,
      sort_dir: null as string | null,
      filter: "TEST",
    };
    let result = await repository.search(
      new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        filter: "TEST",
      })
    );
    const { items: itemsResult, ...output } = result;
    expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
    expect(itemsResult.map((item) => item.toJSON())).toMatchObject(
      expectedItems.map((item) => item.toJSON())
    );
    expect(output).toStrictEqual(expected);

    expectedItems = [CategoryModelMapper.toEntity(categories[3])];
    result = await repository.search(
      new CategoryRepository.SearchParams({
        page: 2,
        per_page: 2,
        filter: "TEST",
      })
    );
    expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
    expect(result.items.map((item) => item.toJSON())).toMatchObject(
      expectedItems.map((item) => item.toJSON())
    );
  });

  it("should apply paginate and sort", async () => {
    const defaultProps = {
      description: null,
      is_active: true,
      created_at: new Date(),
    };
    const categoriesProp = [
      { id: chance.guid({ version: 4 }), name: "b", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "d", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "e", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "c", ...defaultProps },
    ];
    const categories = await CategoryModel.bulkCreate(categoriesProp);

    let expected = {
      items: [categories[1], categories[0]],
      total: 5,
      current_page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: null,
    };

    const arrange = [
      {
        input: { page: 1, per_page: 2, sort: "name" },
        output: { ...expected },
      },
      {
        input: { page: 2, per_page: 2, sort: "name" },
        output: {
          ...expected,
          items: [categories[4], categories[2]],
          current_page: 2,
        },
      },
      {
        input: { page: 1, per_page: 2, sort: "name", sort_dir: "desc" },
        output: {
          ...expected,
          items: [categories[3], categories[2]],
          sort_dir: "desc",
        },
      },

      {
        input: { page: 2, per_page: 2, sort: "name", sort_dir: "desc" },
        output: {
          ...expected,
          items: [categories[4], categories[0]],
          current_page: 2,
          sort_dir: "desc",
        },
      },
    ];

    for (const item of arrange) {
      let result = await repository.search(
        new CategoryRepository.SearchParams(item.input as any)
      );
      const { items, ...output } = item.output;
      expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(result).toMatchObject(output);
      expect(result.items.map((i) => i.toJSON())).toMatchObject(
        items.map((i) => i.toJSON())
      );
    }
  });

  it("should aplly pagination, filter and sort", async () => {
    const defaultProps = {
      description: null,
      is_active: true,
      created_at: new Date(),
    };
    const categoriesProp = [
      { id: chance.guid({ version: 4 }), name: "test", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "e", ...defaultProps },
      { id: chance.guid({ version: 4 }), name: "TeSt", ...defaultProps },
    ];
    const categories = await CategoryModel.bulkCreate(categoriesProp);
    const expected = {
      items: [categories[2], categories[4]],
      total: 3,
      current_page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "TEST",
    };
    const arrange = [
      {
        input: { page: 1, per_page: 2, sort: "name", filter: "TEST" },
        output: { ...expected, items: [categories[2], categories[4]] },
      },
      {
        input: { page: 2, per_page: 2, sort: "name", filter: "TEST" },
        output: { ...expected, items: [categories[0]], current_page: 2 },
      },
    ];

    for (const item of arrange) {
      let result = await repository.search(
        new CategoryRepository.SearchParams(item.input as any)
      );
      const { items, ...output } = item.output;
      expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(result).toMatchObject(output);
      expect(result.items.map((i) => i.toJSON())).toMatchObject(
        items.map((i) => i.toJSON())
      );
    }
  });
});
