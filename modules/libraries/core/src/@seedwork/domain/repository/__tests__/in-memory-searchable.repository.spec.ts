import Entity from "#seedwork/domain/entity/entity";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory.repository";
import {
  SearchParams,
  SearchResult,
} from "#seedwork/domain/repository/repostiroy-contracts";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubeInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  searchableField: string[] = ["name"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.props.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
        i.props.price.toString() == filter
      );
    });
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  let repository: StubeInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubeInMemorySearchableRepository();
  });

  describe("applyFilter method", () => {
    it("should no filter items when filter param is null", async () => {
      const items = [new StubEntity({ name: "name value", price: 5 })];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const itemsFiltered = await repository["applyFilter"](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "fake", price: 0 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      let itemsFiltered = await repository["applyFilter"](items, "TEST");
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository["applyFilter"](items, "5");
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository["applyFilter"](items, "no-filter");
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe("applySort method", () => {
    it("should no sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
      ];

      let itemsSorted = await repository["applySort"](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository["applySort"](items, "price", "asc");
      expect(itemsSorted).toStrictEqual(items);
    });

    it("should sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
      ];

      let itemsSorted = await repository["applySort"](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("applyPaginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "d", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
      ];
      let itemsPaginated = await repository["applyPagination"](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await repository["applyPagination"](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await repository["applyPagination"](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await repository["applyPagination"](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe("search method", () => {
    it("should apply only paginate when other params are null", async () => {
      const entity = new StubEntity({ name: "a", price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;
      const expected = new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(expected);
    });

    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "TeSt", price: 5 }),
        new StubEntity({ name: "fake", price: 0 }),
      ];
      repository.items = items;
      const expected = {
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null as string | null,
        sort_dir: null as string | null,
        filter: "TEST",
      };
      let result = await repository.search(
        new SearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );
      expect(result).toStrictEqual(new SearchResult(expected));

      result = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({ ...expected, items: [items[3]], current_page: 2 })
      );
    });

    it("should apply paginate and sort", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "d", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
        new StubEntity({ name: "c", price: 0 }),
      ];
      const expected = {
        items: [items[1], items[0]],
        total: 5,
        current_page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: null as string | null,
      };
      const arrange = [
        {
          input: { page: 1, per_page: 2, sort: "name" },
          output: { ...expected },
        },
        {
          input: { page: 2, per_page: 2, sort: "name" },
          output: { ...expected, items: [items[4], items[2]], current_page: 2 },
        },
        {
          input: { page: 1, per_page: 2, sort: "name", sort_dir: "desc" },
          output: {
            ...expected,
            items: [items[3], items[2]],
            sort_dir: "desc",
          },
        },

        {
          input: { page: 2, per_page: 2, sort: "name", sort_dir: "desc" },
          output: {
            ...expected,
            items: [items[4], items[0]],
            current_page: 2,
            sort_dir: "desc",
          },
        },
      ];
      repository.items = items;

      for (const item of arrange) {
        let result = await repository.search(
          new SearchParams(item.input as any)
        );
        expect(result).toStrictEqual(new SearchResult(item.output));
      }
    });

    it("should aplly pagination, filter and sort", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
        new StubEntity({ name: "TeSt", price: 0 }),
      ];
      const expected = {
        items: [items[2], items[4]],
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
          output: { ...expected, items: [items[2], items[4]] },
        },
        {
          input: { page: 2, per_page: 2, sort: "name", filter: "TEST" },
          output: { ...expected, items: [items[0]], current_page: 2 },
        },
      ];
      repository.items = items;

      for (const item of arrange) {
        let result = await repository.search(
          new SearchParams(item.input as any)
        );
        expect(result).toStrictEqual(new SearchResult(item.output));
      }
    });
  });
});
