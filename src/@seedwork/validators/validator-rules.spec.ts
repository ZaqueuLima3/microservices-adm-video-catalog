import ValidationError from "../errors/validation-error";
import ValidatorRules from "./validator-rules";

type Values = {
  value: any;
  property: string;
};

type ExpectedInvalidRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error?: ValidationError;
  params?: any[];
};

type ExpectedValidRule = Omit<ExpectedInvalidRule, "error">;

function validationRule({ params = [], ...props }: ExpectedInvalidRule) {
  const validator = ValidatorRules.values(props.value, props.property);
  const method = validator[props.rule];
  method.apply(validator, params);
}

function assertIsInvalid(props: ExpectedInvalidRule) {
  expect(() => {
    validationRule(props);
  }).toThrow(props.error);
}

function assertIsValid(props: ExpectedValidRule) {
  expect(() => {
    validationRule(props);
  }).not.toThrow();
}

describe("Validator rules Unit Test", () => {
  const emptyValues: Values[] = [
    { value: null, property: "field" },
    { value: undefined, property: "field" },
  ];

  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validate rule", () => {
    let arrange: Values[] = [{ value: "", property: "field" }, ...emptyValues];
    arrange.forEach((data) => {
      const error = new ValidationError(`The ${data.property} is required`);
      assertIsInvalid({
        value: data.value,
        property: data.property,
        rule: "required",
        error: error,
      });
    });

    arrange = [
      { value: "test", property: "field" },
      { value: 5, property: "field" },
      { value: 0, property: "field" },
      { value: false, property: "field" },
    ];
    arrange.forEach((data) => {
      assertIsValid({
        value: data.value,
        property: data.property,
        rule: "required",
      });
    });
  });

  test("string validate rule", () => {
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: false, property: "field" },
    ];
    arrange.forEach((data) => {
      const error = new ValidationError(
        `The ${data.property} must be a string`
      );
      assertIsInvalid({
        value: data.value,
        property: data.property,
        rule: "string",
        error: error,
      });
    });

    arrange = [{ value: "valid value", property: "field" }, ...emptyValues];
    arrange.forEach((data) => {
      assertIsValid({
        value: data.value,
        property: data.property,
        rule: "string",
      });
    });
  });
  test("maxLength validate rule", () => {
    let arrange: Values[] = [{ value: "aaaaaa", property: "field" }];

    arrange.forEach((data) => {
      const error = new ValidationError(
        `The ${data.property} must be less or equal than ${4} characters`
      );
      assertIsInvalid({
        value: data.value,
        property: data.property,
        rule: "maxLength",
        error: error,
        params: [4],
      });
    });

    arrange = [{ value: "value", property: "field" }, ...emptyValues];
    arrange.forEach((data) => {
      assertIsValid({
        value: data.value,
        property: data.property,
        rule: "maxLength",
        params: [5],
      });
    });
  });

  test("boolean validate rule", () => {
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: "true", property: "field" },
      { value: "false", property: "field" },
    ];
    arrange.forEach((data) => {
      const error = new ValidationError(
        `The ${data.property} must be a boolean`
      );
      assertIsInvalid({
        value: data.value,
        property: data.property,
        rule: "boolean",
        error: error,
      });
    });

    arrange = [
      { value: true, property: "field" },
      { value: false, property: "field" },
      ...emptyValues,
    ];
    arrange.forEach((data) => {
      assertIsValid({
        value: data.value,
        property: data.property,
        rule: "boolean",
      });
    });
  });

  it("should throws the first error when combine two or more validation rules", () => {
    let arrange = [
      { value: null, error: "The field is required" },
      { value: 5, error: "The field must be a string" },
      {
        value: "invalid",
        error: "The field must be less or equal than 5 characters",
      },
    ];
    arrange.forEach((data) => {
      expect(() => {
        ValidatorRules.values(data.value, "field")
          .required()
          .string()
          .maxLength(5);
      }).toThrow(new ValidationError(data.error));
    });

    arrange = [
      { value: null, error: "The field is required" },
      { value: 5, error: "The field must be a boolean" },
    ];
    arrange.forEach((data) => {
      expect(() => {
        ValidatorRules.values(data.value, "field").required().boolean();
      }).toThrow(new ValidationError(data.error));
    });
  });

  it("should validate when combine two or more validation rules", () => {
    expect(() => {
      ValidatorRules.values("valid", "field").required().string();
      ValidatorRules.values("valid", "field").required().string().maxLength(5);

      ValidatorRules.values(true, "field").required().boolean();
      ValidatorRules.values(false, "field").required().boolean();
    }).not.toThrow();
  });
});
