import UseCase from "../../../@seedwork/application/use-case";
import { CategoryOutput } from "../dto/category-output.dto";
import CategoryRepository from "./../../domain/repository/category.repository";

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
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}
