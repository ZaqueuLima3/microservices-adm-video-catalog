import { Category } from "#category/domain/entities/category";
import { CategoryOutputMapper } from "#category/application/mappers/category-output.mapper";

describe("CategoryOutputMapper Unit Tests", () => {
  it("should convert a category in output", () => {
    const values = {
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: new Date(),
    };
    const category = new Category(values);
    const spyToJSON = jest.spyOn(category, "toJSON");
    const output = CategoryOutputMapper.toCategoryOutput(category);
    expect(spyToJSON).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: category.id,
      ...values,
    });
  });

  it("should convert a list of categories to a list of output", () => {
    const values = {
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: new Date(),
    };
    const categories = [
      new Category(values),
      new Category(values),
      new Category(values),
    ];
    const output = CategoryOutputMapper.toCategoriesOutput(categories);
    expect(output).toStrictEqual([
      { id: categories[0].id, ...values },
      { id: categories[1].id, ...values },
      { id: categories[2].id, ...values },
    ]);
  });
});
