export type FieldErrors = {
  [field: string]: string[];
};

export default interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldErrors;
  validateData: PropsValidated;
  validate(data: any): boolean;
}
