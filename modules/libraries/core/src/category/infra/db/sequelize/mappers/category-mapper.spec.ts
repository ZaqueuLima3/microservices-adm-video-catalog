import { Category } from "#category/domain";
import { LoadEntityError } from "#seedwork/domain";
import { fail } from "assert";
import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../models";
import { CategoryModelMapper } from "./category-mapper";

describe("CategoryModelMapper Unit Tests", () => {
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

  it("should throws an error when category is invalid", () => {
    const model = CategoryModel.build({ id: "fake id" });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid, but it must throws an error");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const error = new Error("Generic Error");
    const spyValidete = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });
    const model = CategoryModel.build({
      id: "745ea3de-c65e-4557-bfe7-b486d5693e4e",
    });
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidete).toHaveBeenCalled();
  });

  it("should conver a category model to a category entity", () => {
    const categoryRawData = {
      id: "745ea3de-c65e-4557-bfe7-b486d5693e4e",
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: new Date(),
    };

    const model = CategoryModel.build(categoryRawData);
    const entity = CategoryModelMapper.toEntity(model);

    const { id, ...rest } = categoryRawData;
    const expected = new Category(rest, id).toJSON();

    expect(entity.toJSON()).toStrictEqual(expected);
  });
});
