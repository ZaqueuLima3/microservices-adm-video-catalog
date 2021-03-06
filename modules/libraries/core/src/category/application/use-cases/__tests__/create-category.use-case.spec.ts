import CreateCategoryUseCase from "../create-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import CategoryRepository from "../../../domain/repository/category.repository";

describe("CreateCategoryUseCase Unit Tests", () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let repository: CategoryRepository.Repository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    createCategoryUseCase = new CreateCategoryUseCase(repository);
  });

  it("should create a category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await createCategoryUseCase.execute({ name: "test" });
    let items = repository.items;
    expect(output).toStrictEqual({
      id: items[0].id,
      name: "test",
      description: null,
      is_active: true,
      created_at: items[0].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);

    output = await createCategoryUseCase.execute({
      name: "test",
      description: "some description",
      is_active: false,
    });
    items = repository.items;
    expect(output).toStrictEqual({
      id: items[1].id,
      name: "test",
      description: "some description",
      is_active: false,
      created_at: items[1].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
  });
});
