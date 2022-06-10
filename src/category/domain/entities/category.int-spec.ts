import Category from "./category";

describe("Category integration Tests", () => {
  describe("create method", () => {
    it("should throws an error when the name is invalid", () => {
      expect(() => {
        new Category({ name: null });
      }).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        new Category({ name: "" });
      }).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => {
        new Category({ name: 5 as any });
      }).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        new Category({ name: "t".repeat(256) });
      }).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throws an error when the description is invalid", () => {
      expect(() => {
        new Category({ name: "Movie", description: 5 as any });
      }).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should throws an error when the is_active is invalid", () => {
      expect(() => {
        new Category({ name: "Movie", is_active: "" as any });
      }).containsErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });
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
      }).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        category.update({ name: "", description: null });
      }).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => {
        category.update({ name: 5 as any, description: null });
      }).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        category.update({ name: "t".repeat(256), description: null });
      }).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throws an error when the description is invalid", () => {
      const category = new Category({ name: "Movie" });
      expect(() => {
        category.update({ name: "Movie", description: 5 as any });
      }).containsErrorMessages({
        description: ["description must be a string"],
      });
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
