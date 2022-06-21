import { SearchResult } from "../../domain/repository/repostiroy-contracts";
import { PaginationOutputMapper } from "./pagination-output.mapper";

describe("PaginationOutputMapper Unit Tests", () => {
  it("should conver a SearchResult to an output", () => {
    const values = {
      items: ["fake"] as any,
      total: 1,
      current_page: 1,
      per_page: 1,
      sort: "name",
      sort_dir: "des",
      filter: "fake",
    };
    const searchResult = new SearchResult(values);
    const output = PaginationOutputMapper.toOutput(searchResult);
    expect(output).toStrictEqual({
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 1,
    });
  });
});
