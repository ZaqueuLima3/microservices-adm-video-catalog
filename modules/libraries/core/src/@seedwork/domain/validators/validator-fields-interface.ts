export type FieldErrors = {
  [field: string]: string[];
};

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldErrors;
  validateData: PropsValidated;
  validate(data: any): boolean;
}

export default ValidatorFieldsInterface;
