import UpdateCategoryUseCase from "#category/application/use-cases/update-category.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import CategoryRepository from "#category/domain/repository/category.repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { Category } from "#category/domain/entities/category";

type Arrange = {
  data: {
    id: string;
    name: string;
    description?: string | null;
    is_active?: boolean;
  };
  expected: {
    name: string;
    description: string | null;
    is_active: boolean;
  };
};

describe("UpdateCategoryUseCase Unit Tests", () => {
  let updateCategoryUseCase: UpdateCategoryUseCase;
  let repository: CategoryRepository.Repository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    updateCategoryUseCase = new UpdateCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    await expect(
      updateCategoryUseCase.execute({ id: "fake-id", name: "fake" })
    ).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake-id"));
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });

  it("should update a category", async () => {
    const items = [new Category({ name: "Movie" })];
    repository.items = items;
    const spyUpdate = jest.spyOn(repository, "update");
    const arrange: Arrange[] = [
      {
        data: { id: items[0].id, name: "test" },
        expected: { name: "test", description: null, is_active: true },
      },
      {
        data: { id: items[0].id, name: "test 1", description: "description" },
        expected: {
          name: "test 1",
          description: "description",
          is_active: true,
        },
      },
      {
        data: { id: items[0].id, name: "test 2", is_active: false },
        expected: { name: "test 2", description: null, is_active: false },
      },
      {
        data: { id: items[0].id, name: "test 2" },
        expected: { name: "test 2", description: null, is_active: false },
      },
      {
        data: { id: items[0].id, name: "test 3", is_active: true },
        expected: { name: "test 3", description: null, is_active: true },
      },
      {
        data: { id: items[0].id, name: "test 4" },
        expected: { name: "test 4", description: null, is_active: true },
      },

      {
        data: {
          id: items[0].id,
          name: "test 4",
          description: "description",
          is_active: false,
        },
        expected: {
          name: "test 4",
          description: "description",
          is_active: false,
        },
      },
    ];

    for (const item of arrange) {
      let output = await updateCategoryUseCase.execute(item.data);
      expect(output).toStrictEqual({
        id: items[0].id,
        name: item.expected.name,
        description: item.expected.description,
        is_active: item.expected.is_active,
        created_at: items[0].created_at,
      });
    }
    expect(spyUpdate).toHaveBeenCalledTimes(arrange.length);
  });
});
