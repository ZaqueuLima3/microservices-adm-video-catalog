import { Category, CategoryProps } from "./category";
import { omit } from "lodash";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });

  test("constructor of category", () => {
    let category = new Category({ name: "Movie" });
    let props = omit(category.props, "created_at");
    expect(Category.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "Movie",
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false,
      created_at,
    });
    expect(category.props).toStrictEqual({
      name: "Movie",
      description: "some description",
      is_active: false,
      created_at,
    });

    category = new Category({
      name: "Movie",
      description: "other description",
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      description: "other description",
    });

    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      is_active: true,
    });

    created_at = new Date();
    category = new Category({
      name: "Movie",
      created_at,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      created_at,
    });
  });

  test("id field", () => {
    type CategoryData = { props: CategoryProps; id?: string };
    const data: CategoryData[] = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      { props: { name: "Movie" }, id: "4e46bfdc-d86c-4eb0-9d21-5b8a8f057b44" },
    ];

    data.forEach((i) => {
      const category = new Category(i.props, i.id);

      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
      if (i.id?.length > 0) expect(category.id).toBe(i.id);
    });

    expect(() => {
      new Category({ name: "Movie" }, "invalid-id");
    }).toThrowError("ID must be a valid UUID");
  });

  test("getter of name prop", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");
  });

  test("getter and setter of description prop", () => {
    let category = new Category({
      name: "Movie",
      description: "some description",
    });
    expect(category.description).toBe("some description");

    category = new Category({
      name: "Movie",
    });
    expect(category.description).toBeNull();

    category["description"] = "other description";
    expect(category.description).toBe("other description");

    category["description"] = undefined;
    expect(category.description).toBeNull();
  });

  test("getter and setter of is_active prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.is_active).toBeTruthy();

    category = new Category({ name: "Movie", is_active: true });
    expect(category.is_active).toBeTruthy();

    category = new Category({ name: "Movie", is_active: false });
    expect(category.is_active).toBeFalsy();
  });

  test("getter of created_at prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({ name: "Movie", created_at });
    expect(category.created_at).toBe(created_at);
  });

  test("update category method", () => {
    const category = new Category({ name: "Movie" });
    category.update({ name: "New Category", description: "New Description" });

    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(category.name).toBe("New Category");
    expect(category.description).toBe("New Description");

    category.update({ name: "New Category", description: null });
    expect(category.description).toBeNull();

    category.update({ name: "New Category", description: undefined });
    expect(category.description).toBeNull();
  });

  test("activate & deactivate category method", () => {
    const category = new Category({ name: "Movie" });
    category.deactivate();
    expect(category.is_active).toBe(false);

    category.activate();
    expect(category.is_active).toBe(true);
  });
});
