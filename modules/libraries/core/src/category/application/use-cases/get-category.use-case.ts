import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";
import { CategoryOutput } from "../dto/category-output.dto";
import { CategoryOutputMapper } from "../mappers/category-output.mapper";
import CategoryRepository from "../../domain/repository/category.repository";

export namespace GetCategoryUseCase {
  export type Input = {
    id: string;
  };

  export type Output = CategoryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);
      return CategoryOutputMapper.toCategoryOutput(entity);
    }
  }
}

export default GetCategoryUseCase.UseCase;
