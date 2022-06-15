import DeleteCategoryUseCase from "#category/application/use-cases/delete-category.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import CategoryRepository from "#category/domain/repository/category.repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import Category from "#category/domain/entities/category";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase;
  let repository: CategoryRepository.Repository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    deleteCategoryUseCase = new DeleteCategoryUseCase(repository);
  });

  it("should throws an error if category doesn't exist", async () => {
    const spyDelete = jest.spyOn(repository, "delete");
    await deleteCategoryUseCase.execute({ id: "fake-id" }).catch((error) => {
      expect(error.message).toBe("Entity Not Found using ID fake-id");
      expect(error).toBeInstanceOf(NotFoundError);
    });
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });

  it("should delete a category", async () => {
    const spyDelete = jest.spyOn(repository, "delete");
    const items = [new Category({ name: "Movie" })];
    repository.items = items;
    expect(repository.items).toHaveLength(1);
    await deleteCategoryUseCase.execute({ id: items[0].id });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});
