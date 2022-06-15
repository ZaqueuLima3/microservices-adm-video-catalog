import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { Category } from "#category/domain/entities/category";
import { CategoryOutput } from "#category/application/dto/category-output.dto";
import { CategoryOutputMapper } from "#category/application/mappers/category-output.mapper";
import CategoryRepository from "#category/domain/repository/category.repository";

export namespace CreateCategoryUseCase {
  export type Input = {
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = new Category(input);
      await this.categoryRepository.insert(entity);
      return CategoryOutputMapper.toCategoryOutput(entity);
    }
  }
}

export default CreateCategoryUseCase.UseCase;
