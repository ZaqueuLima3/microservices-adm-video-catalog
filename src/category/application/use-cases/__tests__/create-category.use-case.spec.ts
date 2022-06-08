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
    let output = await createCategoryUseCase.execute({ name: "test" });
    let items = await repository["items"];
    expect(output).toStrictEqual({
      id: items[0].id.toString(),
      name: "test",
      description: null,
      is_active: true,
      created_at: items[0].created_at,
    });

    output = await createCategoryUseCase.execute({
      name: "test",
      description: "some description",
      is_active: false,
    });
    items = await repository["items"];
    expect(output).toStrictEqual({
      id: items[1].id.toString(),
      name: "test",
      description: "some description",
      is_active: false,
      created_at: items[1].created_at,
    });
  });
});
