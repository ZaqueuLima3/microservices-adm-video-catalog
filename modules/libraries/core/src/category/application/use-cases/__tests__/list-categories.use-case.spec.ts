import ListCategoriesUseCase from "#category/application/use-cases/list-categories.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import { CategoryRepository } from "#category/domain/repository/category.repository";
import { Category } from "#category/domain/entities/category";

describe("ListCategoriesUseCase Unit Tests", () => {
  let listCategoriesUseCase: ListCategoriesUseCase;
  let repository: CategoryRepository.Repository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    listCategoriesUseCase = new ListCategoriesUseCase(repository);
  });

  test("toOutput method", () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    let output = listCategoriesUseCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const category = new Category({ name: "Movie" });
    result = new CategoryRepository.SearchResult({
      items: [category],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    output = listCategoriesUseCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [category.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it("should returns output using empty onput with categories ordered by created_at", async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: "test 1", created_at }),
      new Category({
        name: "test 1",
        created_at: new Date(created_at.getTime() + 100),
      }),
    ];
    repository.items = items;

    const output = await listCategoriesUseCase.execute({});
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[0].toJSON()],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and fitler", async () => {
    const items = [
      new Category({ name: "a" }),
      new Category({ name: "AAA" }),
      new Category({ name: "AaA" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];
    repository.items = items;

    let output = await listCategoriesUseCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await listCategoriesUseCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await listCategoriesUseCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
