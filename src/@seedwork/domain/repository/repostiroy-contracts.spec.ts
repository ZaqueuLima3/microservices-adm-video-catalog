import { SearchParams, SearchResult } from "./repostiroy-contracts";

describe("SeachParams Unit Tests", () => {
  test("page prop", () => {
    let params = new SearchParams();
    expect(params.page).toBe(1);

    const arrange = [
      { input: { page: null }, expected: 1 },
      { input: { page: undefined }, expected: 1 },
      { input: { page: "" }, expected: 1 },
      { input: { page: "fake" }, expected: 1 },
      { input: { page: 0 }, expected: 1 },
      { input: { page: -1 }, expected: 1 },
      { input: { page: 5.5 }, expected: 1 },
      { input: { page: false }, expected: 1 },
      { input: { page: true }, expected: 1 },
      { input: { page: {} }, expected: 1 },
      { input: { page: 1 }, expected: 1 },
      { input: { page: 2 }, expected: 2 },
    ];

    arrange.forEach((item) => {
      params = new SearchParams(item.input as any);
      expect(params.page).toBe(item.expected);
    });
  });

  test("per_page prop", () => {
    let params = new SearchParams();
    expect(params.per_page).toBe(15);

    const arrange = [
      { input: { per_page: null }, expected: 15 },
      { input: { per_page: undefined }, expected: 15 },
      { input: { per_page: "" }, expected: 15 },
      { input: { per_page: "fake" }, expected: 15 },
      { input: { per_page: 0 }, expected: 15 },
      { input: { per_page: -1 }, expected: 15 },
      { input: { per_page: 5.5 }, expected: 15 },
      { input: { per_page: false }, expected: 15 },
      { input: { per_page: {} }, expected: 15 },
      { input: { per_page: 15 }, expected: 15 },
      { input: { per_page: 10 }, expected: 10 },
      { input: { per_page: 2 }, expected: 2 },
      { input: { per_page: true }, expected: 15 },
    ];

    arrange.forEach((item) => {
      params = new SearchParams(item.input as any);
      expect(params.per_page).toBe(item.expected);
    });
  });

  test("sort prop", () => {
    let params = new SearchParams();
    expect(params.sort).toBeNull();

    const arrange = [
      { input: { sort: null }, expected: null },
      { input: { sort: undefined }, expected: null },
      { input: { sort: "" }, expected: null },
      { input: { sort: 0 }, expected: "0" },
      { input: { sort: -1 }, expected: "-1" },
      { input: { sort: 5.5 }, expected: "5.5" },
      { input: { sort: false }, expected: "false" },
      { input: { sort: true }, expected: "true" },
      { input: { sort: {} }, expected: "[object Object]" },
      { input: { sort: "field" }, expected: "field" },
      { input: { sort: 15 }, expected: "15" },
      { input: { sort: 10 }, expected: "10" },
      { input: { sort: 2 }, expected: "2" },
    ];

    arrange.forEach((item) => {
      params = new SearchParams(item.input as any);
      expect(params.sort).toBe(item.expected);
    });
  });

  test("sort_dir prop", () => {
    let params = new SearchParams();
    expect(params.sort_dir).toBeNull();

    const arrange = [
      { input: { sort: null, sort_dir: "asc" }, expected: null },
      { input: { sort: undefined, sort_dir: "asc" }, expected: null },
      { input: { sort: "", sort_dir: "asc" }, expected: null },

      { input: { sort_dir: null }, expected: "asc" },
      { input: { sort_dir: undefined }, expected: "asc" },
      { input: { sort_dir: "" }, expected: "asc" },
      { input: { sort_dir: 0 }, expected: "asc" },
      { input: { sort_dir: -1 }, expected: "asc" },
      { input: { sort_dir: 5.5 }, expected: "asc" },
      { input: { sort_dir: false }, expected: "asc" },
      { input: { sort_dir: true }, expected: "asc" },
      { input: { sort_dir: {} }, expected: "asc" },
      { input: { sort_dir: "field" }, expected: "asc" },
      { input: { sort_dir: 15 }, expected: "asc" },
      { input: { sort_dir: 10 }, expected: "asc" },
      { input: { sort_dir: 2 }, expected: "asc" },

      { input: { sort_dir: "ASC" }, expected: "asc" },
      { input: { sort_dir: "asc" }, expected: "asc" },
      { input: { sort_dir: "desc" }, expected: "desc" },
      { input: { sort_dir: "DESC" }, expected: "desc" },
    ];

    arrange.forEach((item) => {
      let input: any = item.input;
      if (!("sort" in input)) {
        input = {
          ...item.input,
          sort: "filed",
        };
      }
      params = new SearchParams(input);
      expect(params.sort_dir).toBe(item.expected);
    });
  });

  test("filter prop", () => {
    let params = new SearchParams();
    expect(params.filter).toBeNull();

    const arrange = [
      { input: { filter: null }, expected: null },
      { input: { filter: undefined }, expected: null },
      { input: { filter: "" }, expected: null },
      { input: { filter: 0 }, expected: "0" },
      { input: { filter: -1 }, expected: "-1" },
      { input: { filter: 5.5 }, expected: "5.5" },
      { input: { filter: false }, expected: "false" },
      { input: { filter: true }, expected: "true" },
      { input: { filter: {} }, expected: "[object Object]" },
      { input: { filter: "field" }, expected: "field" },
      { input: { filter: 15 }, expected: "15" },
      { input: { filter: 10 }, expected: "10" },
      { input: { filter: 2 }, expected: "2" },
    ];

    arrange.forEach((item) => {
      params = new SearchParams(item.input as any);
      expect(params.filter).toBe(item.expected);
    });
  });
});

describe("SearcgResult Unit Tests", () => {
  test("constructor props", () => {
    let result = new SearchResult({
      items: ["entity1", "entity2"] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    expect(result.toJSON()).toStrictEqual({
      items: ["entity1", "entity2"],
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      last_page: 2,
    });

    result = new SearchResult({
      items: ["entity1", "entity2"] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "test",
    });

    expect(result.toJSON()).toStrictEqual({
      items: ["entity1", "entity2"],
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "test",
    });
  });

  it("should set last_page equal 1 when per_page field is greater than total field", () => {
    let result = new SearchResult({
      items: ["entity1", "entity2"] as any,
      total: 4,
      current_page: 1,
      per_page: 15,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    expect(result.last_page).toBe(1);
  });

  test("last_page prop when total is not multiple of per_page", () => {
    let result = new SearchResult({
      items: ["entity1", "entity2"] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    expect(result.last_page).toBe(6);
  });
});
