import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import ClassValidatorFields from "../class-validator-fields";

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class StubClassValidator extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe("Class validator field tests", () => {
  it("should validate errors", () => {
    const expectedErrors = {
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
      price: [
        "price should not be empty",
        "price must be a number conforming to the specified constraints",
      ],
    };
    const validator = new StubClassValidator();
    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual(expectedErrors);
  });

  it("should be valid", () => {
    const validator = new StubClassValidator();
    expect(validator.validate({ name: "value", price: 5 })).toBeTruthy();
    expect(validator.validateData).toStrictEqual(
      new StubRules({ name: "value", price: 5 })
    );
  });
});
