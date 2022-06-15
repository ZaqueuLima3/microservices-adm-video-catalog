import { validateSync } from "class-validator";
import ValidatorFieldsInterface, {
  FieldErrors,
} from "#seedwork/domain/validators/validator-fields-interface";

export default abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldErrors = null;
  validateData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validateData = data;
    }
    return !errors.length;
  }
}
