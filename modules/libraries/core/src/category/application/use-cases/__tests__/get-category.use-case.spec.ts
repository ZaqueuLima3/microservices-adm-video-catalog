import GetCategoryUseCase from "#category/application/use-cases/get-category.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import CategoryRepository from "#category/domain/repository/category.repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { Category } from "#category/domain/entities/category";

describe("GetCategoryUseCase Unit Tests", () => {
  let getCategoryUseCase: GetCategoryUseCase;
  let repository: CategoryRepository.Repository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    getCategoryUseCase = new GetCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    await expect(() =>
      getCategoryUseCase.execute({ id: "fake-id" })
    ).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake-id"));
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });

  it("should return a category", async () => {
    const items = [new Category({ name: "Movies" })];
    const spyFindById = jest.spyOn(repository, "findById");
    repository.items = items;
    let output = await getCategoryUseCase.execute({ id: items[0].id });

    expect(output).toStrictEqual({
      id: items[0].id,
      name: "Movies",
      description: null,
      is_active: true,
      created_at: items[0].created_at,
    });
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });
});
