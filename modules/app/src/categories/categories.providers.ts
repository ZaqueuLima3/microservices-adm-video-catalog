import { CategoryInMemoryRepository } from '@micro-videos/core/category/infra';
import { CategoryRepository } from '@micro-videos/core/category/domain';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
} from '@micro-videos/core/category/application';

export namespace CatecoriesProviders {
  export namespace Repositories {
    export const CATEGORY_IN_MEMORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }

  export namespace UseCases {
    export const CREATE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CATEGORY_IN_MEMORY.provide],
    };

    export const LIST = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CATEGORY_IN_MEMORY.provide],
    };

    export const UPDATE = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CATEGORY_IN_MEMORY.provide],
    };

    export const DELETE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CATEGORY_IN_MEMORY.provide],
    };

    export const GET = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CATEGORY_IN_MEMORY.provide],
    };
  }
}
