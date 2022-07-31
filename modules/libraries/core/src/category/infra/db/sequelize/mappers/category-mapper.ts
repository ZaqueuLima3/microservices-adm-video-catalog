import { Category } from "#category/domain";
import { EntityValidationError, LoadEntityError } from "#seedwork/domain";
import { CategoryModel } from "../models";

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    try {
      const { id, ...data } = model.toJSON();
      return new Category(data, id);
    } catch (error) {
      if (error instanceof EntityValidationError) {
        throw new LoadEntityError(error.error);
      }
      throw error;
    }
  }
}
