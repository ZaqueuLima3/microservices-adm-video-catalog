import { SearchResult } from "../../domain/repository/repostiroy-contracts";
import { PaginationOutput } from "../dto/pagination-output.dto";

export class PaginationOutputMapper {
  static toOutput(result: SearchResult): Omit<PaginationOutput, "items"> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}
