import { CreateCategoryUseCase } from '@micro-videos/core/category/application';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  name: string;
  description?: string;
  is_active?: boolean;
}
