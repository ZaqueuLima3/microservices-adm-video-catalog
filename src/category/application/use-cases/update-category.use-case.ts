import UseCase from "../../../@seedwork/application/use-case";
import Category from "../../domain/entities/category";
import { CategoryOutput } from "../dto/category-output.dto";
import { CategoryOutputMapper } from "../mappers/category-output.mapper";
import { CategoryRepository } from "./../../domain/repository/category.repository";

export type Input = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;

export default class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    entity.update({ name: input.name, description: input.description });

    if (input.is_active === true) {
      entity.activate();
    }

    if (input.is_active === false) {
      entity.deactivate();
    }

    await this.categoryRepository.update(entity);
    return CategoryOutputMapper.toCategoryOutput(entity);
  }
}
