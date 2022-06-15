import { Category } from "#category/domain/entities/category";
import { CategoryOutput } from "#category/application/dto/category-output.dto";

export class CategoryOutputMapper {
  static toCategoryOutput(category: Category): CategoryOutput {
    return category.toJSON();
  }

  static toCategoriesOutput(categories: Category[]): CategoryOutput[] {
    return categories.map((category) => this.toCategoryOutput(category));
  }
}
