import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category-model";

describe("CategoryModel Unit Tests", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      host: ":memory:",
      logging: false,
      models: [CategoryModel],
    });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("mapping props", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

    const idAttr = attributesMap.id;
    expect(idAttr).toMatchObject({
      fieldName: "id",
      field: "id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      fieldName: "name",
      field: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      fieldName: "description",
      field: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      fieldName: "is_active",
      field: "is_active",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      fieldName: "created_at",
      field: "created_at",
      allowNull: false,
      type: DataType.DATE(),
    });
  });

  test("create", async () => {
    const id = "745ea3de-c65e-4557-bfe7-b486d5693e4e";
    const arrange = {
      id,
      name: "Test",
      is_active: true,
      created_at: new Date(),
    };
    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
