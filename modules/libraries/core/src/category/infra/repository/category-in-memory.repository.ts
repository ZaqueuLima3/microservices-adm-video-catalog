import { SortDirection } from "../../../@seedwork/domain/repository/repostiroy-contracts";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory.repository";
import { Category } from "../../domain/entities/category";
import CategoryRepository from "../../domain/repository/category.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  searchableField: string[] = ["name", "created_at"];

  protected applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection
  ): Promise<Category[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }
    return super.applySort(items, sort, sort_dir);
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.props.name
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase());
    });
  }
}

export default CategoryInMemoryRepository;
