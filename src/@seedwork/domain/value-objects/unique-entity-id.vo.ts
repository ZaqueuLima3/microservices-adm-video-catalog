import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import InvalidUuidError from "#seedwork/domain/errors/invalid-uuid.error";
import ValueObject from "#seedwork/domain/value-objects/value-object";

export default class UniqueEntityId extends ValueObject<string> {
  constructor(id?: string) {
    super(id || uuidv4());
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }
}
