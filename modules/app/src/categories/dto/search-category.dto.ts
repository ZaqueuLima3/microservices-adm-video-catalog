import { ListCategoriesUseCase } from '@micro-videos/core/category/application';
import { SortDirection } from '@micro-videos/core/dist/@seedwork/domain/repository/repostiroy-contracts';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: string;
}
