import Category from "../../domain/entities/category";
import { CategoryOutput } from "../dto/category-output.dto";

export class CategoryOutputMapper {
  static toCategoryOutput(category: Category): CategoryOutput {
    return category.toJSON();
  }

  static toCategoriesOutput(categories: Category[]): CategoryOutput[] {
    return categories.map((category) => this.toCategoryOutput(category));
  }
}
