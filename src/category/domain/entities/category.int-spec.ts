import ValidationError from "../../../@seedwork/errors/validation-error";
import Category, { MAX_NAME_VALUE } from "./category";

describe("Category integration Tests", () => {
  describe("create method", () => {
    it("should throws an error when the name is invalid", () => {
      expect(() => {
        new Category({ name: null });
      }).toThrow(new ValidationError("The name is required"));

      expect(() => {
        new Category({ name: "" });
      }).toThrow(new ValidationError("The name is required"));

      expect(() => {
        new Category({ name: 5 as any });
      }).toThrow(new ValidationError("The name must be a string"));

      expect(() => {
        new Category({ name: "t".repeat(256) });
      }).toThrow(
        new ValidationError(
          `The name must be less or equal than ${MAX_NAME_VALUE} characters`
        )
      );
    });

    it("should throws an error when the description is invalid", () => {
      expect(() => {
        new Category({ name: "Movie", description: 5 as any });
      }).toThrow(new ValidationError("The description must be a string"));
    });

    it("should throws an error when the description is invalid", () => {
      expect(() => {
        new Category({ name: "Movie", is_active: "" as any });
      }).toThrow(new ValidationError("The is_active must be a boolean"));
    });

    it("should create a valid category", () => {
      expect(() => {
        new Category({ name: "Movie" });
        new Category({ name: "Movie", description: "some description" });
        new Category({ name: "Movie", description: null });
        new Category({
          name: "Movie",
          description: "some description",
          is_active: false,
        });
        new Category({
          name: "Movie",
          description: "some description",
          is_active: true,
        });
      }).not.toThrow();
    });
  });

  describe("update method", () => {
    it("should throws an error when the name is invalid", () => {
      const category = new Category({ name: "Movie" });
      expect(() => {
        category.update({ name: null, description: null });
      }).toThrow(new ValidationError("The name is required"));

      expect(() => {
        category.update({ name: "", description: null });
      }).toThrow(new ValidationError("The name is required"));

      expect(() => {
        category.update({ name: 5 as any, description: null });
      }).toThrow(new ValidationError("The name must be a string"));

      expect(() => {
        category.update({ name: "t".repeat(256), description: null });
      }).toThrow(
        new ValidationError(
          `The name must be less or equal than ${MAX_NAME_VALUE} characters`
        )
      );
    });

    it("should throws an error when the description is invalid", () => {
      const category = new Category({ name: "Movie" });
      expect(() => {
        category.update({ name: "Movie", description: 5 as any });
      }).toThrow(new ValidationError("The description must be a string"));
    });

    it("should update a valid category", () => {
      expect(() => {
        const category = new Category({ name: "Movie" });
        category.update({ name: "new value", description: null });
        category.update({ name: "new value", description: "some description" });
      }).not.toThrow();
    });
  });
});
