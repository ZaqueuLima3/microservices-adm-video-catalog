import UseCase from "../../../@seedwork/application/use-case";
import CategoryRepository from "./../../domain/repository/category.repository";

export type Input = {
  id: string;
};

export default class GetCategoryUseCase implements UseCase<Input, void> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<void> {
    await this.categoryRepository.delete(input.id);
  }
}
