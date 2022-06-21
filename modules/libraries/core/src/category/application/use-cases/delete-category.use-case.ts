import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";
import CategoryRepository from "../../domain/repository/category.repository";

export namespace DeleteCategoryUseCase {
  export type Input = {
    id: string;
  };

  export class UseCase implements DefaultUseCase<Input, void> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository
    ) {}

    async execute(input: Input): Promise<void> {
      await this.categoryRepository.delete(input.id);
    }
  }
}

export default DeleteCategoryUseCase.UseCase;
