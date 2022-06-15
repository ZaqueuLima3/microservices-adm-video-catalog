import { SearchParams } from "#seedwork/domain/repository/repostiroy-contracts";
import Category from "#category/domain/entities/category";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";

describe("CategoryInMemoryRepository Unit Tests", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it("should sort by created_at if sort is null", async () => {
    const date = new Date();
    const categories = [
      new Category({ name: "Movie 3", created_at: date }),
      new Category({
        name: "Movie 1",
        created_at: new Date(date.getTime() - 400),
      }),
      new Category({
        name: "Movie 2",
        created_at: new Date(date.getTime() + 500),
      }),
    ];
    for (const category of categories) {
      await repository.insert(category);
    }

    const result = await repository.search(new SearchParams());
    expect(result.total).toBe(3);
    expect(result.items).toStrictEqual([
      categories[2],
      categories[0],
      categories[1],
    ]);
  });

  it("should sort by the sort field passed as params", async () => {
    const categories = [
      new Category({ name: "Movie 3" }),
      new Category({ name: "Movie 1" }),
      new Category({ name: "Movie 2" }),
    ];
    for (const category of categories) {
      await repository.insert(category);
    }

    const result = await repository.search(
      new SearchParams({
        sort: "name",
        sort_dir: "asc",
      })
    );
    expect(result.total).toBe(3);
    expect(result.items).toStrictEqual([
      categories[1],
      categories[2],
      categories[0],
    ]);
  });

  it("should filter items that includes the filter field value passed as param", async () => {
    const created_at = new Date();
    const categories = [
      new Category({ name: "Movie 3", created_at }),
      new Category({ name: "Test 1", created_at }),
      new Category({ name: "Movie 2", created_at }),
      new Category({ name: "TEST 2", created_at }),
    ];
    for (const category of categories) {
      await repository.insert(category);
    }

    let result = await repository.search(
      new SearchParams({
        filter: "TEST",
      })
    );
    expect(result.total).toBe(2);
    expect(result.items).toStrictEqual([categories[1], categories[3]]);
  });
});
