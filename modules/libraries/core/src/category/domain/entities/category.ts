import { EntityValidationError } from "#seedwork/domain/errors/validation-error";
import Entity from "#seedwork/domain/entity/entity";
import CategoryValidatorFactory from "#category/domain/validators/category-validator";

export type CategoryProps = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export const MAX_NAME_VALUE = 255;

export class Category extends Entity<CategoryProps> {
  constructor(public readonly props: CategoryProps, id?: string) {
    Category.validate(props);
    super(props, id);
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  static validate(props: CategoryProps) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  update(data: { name: string; description: string }) {
    Category.validate(data);
    this.name = data.name;
    this.description = data.description;
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active() {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at() {
    return this.props.created_at;
  }
}
