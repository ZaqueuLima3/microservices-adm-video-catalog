import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from "./category-validator";

describe("CategoryValidator Tests", () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });

  describe("invalidation cases for name field", () => {
    const errors = [
      "name should not be empty",
      "name must be a string",
      "name must be shorter than or equal to 255 characters",
    ];
    const arrange = [
      { data: null, expect: [...errors] },
      { data: { name: "" }, expect: [errors[0]] },
      { data: { name: "t".repeat(256) }, expect: [errors[2]] },
      { data: { name: 5 as any }, expect: [errors[1], errors[2]] },
    ];

    test.each(arrange)("validade %j", (item) => {
      const isValid = validator.validate(item.data);
      expect(isValid).toBeFalsy();
      expect(validator.errors["name"]).toStrictEqual(item.expect);
    });
  });

  describe("invalidation cases for description field", () => {
    const errors = ["description must be a string"];
    const arrange = [{ data: { description: 5 as any }, expect: errors }];

    test.each(arrange)("validade %j", (item) => {
      const isValid = validator.validate({ name: "some value", ...item.data });
      expect(isValid).toBeFalsy();
      expect(validator.errors["description"]).toStrictEqual(item.expect);
    });
  });

  describe("invalidation cases for is_active field", () => {
    const errors = ["is_active must be a boolean value"];
    const arrange = [
      { data: { is_active: 5 as any }, expect: errors },
      { data: { is_active: 0 as any }, expect: errors },
      { data: { is_active: 1 as any }, expect: errors },
    ];

    test.each(arrange)("validade %j", (item) => {
      const isValid = validator.validate({ name: "some value", ...item.data });
      expect(isValid).toBeFalsy();
      expect(validator.errors["is_active"]).toStrictEqual(item.expect);
    });
  });

  describe("valid cases for fields", () => {
    type Arrange = {
      name: string;
      description?: string;
      is_active?: boolean;
    };
    const arrange: Arrange[] = [
      { name: "some value" },
      { name: "some value", description: undefined },
      { name: "some value", description: null },
      { name: "some value", is_active: true },
      { name: "some value", is_active: false },
    ];

    test.each(arrange)("validade %j", (item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validateData).toStrictEqual(new CategoryRules(item));
    });
  });
});
