import { PaginationOutput } from "../../../@seedwork/application/dto/pagination-output.dto";
import { SearchInput } from "../../../@seedwork/application/dto/search-input.dto";
import { PaginationOutputMapper } from "../../../@seedwork/application/mappers/pagination-output.mapper";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";
import { CategoryOutput } from "../dto/category-output.dto";
import { CategoryOutputMapper } from "../mappers/category-output.mapper";
import { CategoryRepository } from "../../domain/repository/category.repository";

export namespace ListCategoriesUseCase {
  export type Input = SearchInput<CategoryRepository.Filter>;

  export type Output = PaginationOutput<CategoryOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
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
}

export default ListCategoriesUseCase.UseCase;
