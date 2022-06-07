import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from "../../../@seedwork/domain/repository/repostiroy-contracts";
import Category from "../entities/category";

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<
  Category,
  CategoryFilter
> {}

export default interface CategoryRepository
  extends SearchableRepositoryInterface<
    Category,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
