import UseCase from "#seedwork/application/use-case";
import { CategoryOutput } from "#category/application/dto/category-output.dto";
import { CategoryOutputMapper } from "#category/application/mappers/category-output.mapper";
import CategoryRepository from "#category/domain/repository/category.repository";

export type Input = {
  id: string;
};

export type Output = CategoryOutput;

export default class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    return CategoryOutputMapper.toCategoryOutput(entity);
  }
}
