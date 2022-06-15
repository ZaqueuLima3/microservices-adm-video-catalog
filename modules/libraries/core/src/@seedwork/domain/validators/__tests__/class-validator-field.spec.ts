import ClassValidatorFields from "#seedwork/domain/validators/class-validator-fields";
import * as libClassValidator from "class-validator";

class StubClassValidator extends ClassValidatorFields<{ field: string }> {}

describe("Class validator field tests", () => {
  it("should initialize error and validatedData with null", () => {
    const validator = new StubClassValidator();
    expect(validator.errors).toBeNull();
    expect(validator.validateData).toBeNull();
  });

  it("should validate with errors", () => {
    const validateSyncSpy = jest.spyOn(libClassValidator, "validateSync");
    validateSyncSpy.mockReturnValue([
      {
        property: "field",
        constraints: { isRequired: "some error" },
      },
    ]);
    const validator = new StubClassValidator();
    expect(validator.validate(null)).toBeFalsy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(validator.validateData).toBeNull();
    expect(validator.errors).toStrictEqual({ field: ["some error"] });
  });

  it("should validate without errors", () => {
    const validateSyncSpy = jest.spyOn(libClassValidator, "validateSync");
    validateSyncSpy.mockReturnValue([]);
    const validator = new StubClassValidator();
    expect(validator.validate({ field: "value" })).toBeTruthy();
    expect(validateSyncSpy).toHaveBeenCalled();
    expect(validator.validateData).toStrictEqual({ field: "value" });
    expect(validator.errors).toBeNull();
  });
});
