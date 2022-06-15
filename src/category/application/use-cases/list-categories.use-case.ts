import { PaginationOutput } from "#seedwork/application/dto/pagination-output.dto";
import { SearchInput } from "#seedwork/application/dto/search-input.dto";
import { PaginationOutputMapper } from "#seedwork/application/mappers/pagination-output.mapper";
import UseCase from "#seedwork/application/use-case";
import { CategoryOutput } from "#category/application/dto/category-output.dto";
import { CategoryOutputMapper } from "#category/application/mappers/category-output.mapper";
import { CategoryRepository } from "#category/domain/repository/category.repository";

export type Input = SearchInput<CategoryRepository.Filter>;

export type Output = PaginationOutput<CategoryOutput>;

export default class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategoryRepository.SearchResult): Output {
    const items = CategoryOutputMapper.toCategoriesOutput(searchResult.items);
    const pagination = PaginationOutputMapper.toOutput(searchResult);
    return { items, ...pagination };
  }
}
