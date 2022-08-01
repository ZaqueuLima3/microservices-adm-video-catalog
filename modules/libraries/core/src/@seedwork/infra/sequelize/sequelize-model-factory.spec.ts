import {
  Model,
  Table,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import { validate as uuidValidate } from "uuid";
import _chance from "chance";
import { setupSequelize } from "#category/infra/testing/helpers/db";

const chance = _chance();
@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name;

  static mockFactory = jest.fn((data) => ({
    id: data?.id || chance.guid({ version: 4 }),
    name: data?.name || chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory<StubModel, { id?: string; name?: string }>(
      StubModel,
      StubModel.mockFactory
    );
  }
}

describe("SequelizeModelFactory Unit Tests", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();

    model = await StubModel.factory().create({ name: "Movie" });
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).toBe("Movie");

    model = await StubModel.factory().create({
      id: "745ea3de-c65e-4557-bfe7-b486d5693e4e",
    });
    expect(model.id).toBe("745ea3de-c65e-4557-bfe7-b486d5693e4e");

    expect(StubModel.mockFactory).toBeCalledTimes(3);

    const modelFound = await StubModel.findByPk(model.id);
    expect(modelFound.id).toBe(model.id);
  });

  test("make method", () => {
    let model = StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();

    model = StubModel.factory().make({ name: "Movie" });
    expect(uuidValidate(model.id)).toBeTruthy();

    model = StubModel.factory().make({
      id: "745ea3de-c65e-4557-bfe7-b486d5693e4e",
    });
    expect(model.id).toBe("745ea3de-c65e-4557-bfe7-b486d5693e4e");

    expect(StubModel.mockFactory).toBeCalledTimes(3);
  });

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();

    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);

    const modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound.id).toBe(models[0].id);
    expect(modelFound.name).toBe(models[0].name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "745ea3de-c65e-4557-bfe7-b486d5693e4e",
      name: "Movie",
    }));
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).toBe("Movie");
    expect(models[0].id).toBe("745ea3de-c65e-4557-bfe7-b486d5693e4e");
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkCreate();

    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(uuidValidate(models[1].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(2);

    const modelFound1 = await StubModel.findByPk(models[0].id);
    expect(modelFound1.id).toBe(models[0].id);
    expect(modelFound1.name).toBe(models[0].name);

    const modelFound2 = await StubModel.findByPk(models[1].id);
    expect(modelFound2.id).toBe(models[1].id);
    expect(modelFound2.name).toBe(models[1].name);

    const id1 = chance.guid({ version: 4 });
    const id2 = chance.guid({ version: 4 });
    models = await StubModel.factory()
      .count(2)
      .bulkCreate((index) => ({
        id: index % 2 === 0 ? id1 : id2,
        name: "Movie",
      }));
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(uuidValidate(models[1].id)).toBeTruthy();
    expect(models[0].id).toBe(id1);
    expect(models[1].id).toBe(id2);
    expect(models[0].name).toBe("Movie");
    expect(models[1].name).toBe("Movie");
  });

  test("bulkMake method using count = 1", () => {
    let models = StubModel.factory().bulkMake();

    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);

    models = StubModel.factory().bulkMake(() => ({
      id: "745ea3de-c65e-4557-bfe7-b486d5693e4e",
      name: "Movie",
    }));
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).toBe("Movie");
    expect(models[0].id).toBe("745ea3de-c65e-4557-bfe7-b486d5693e4e");
  });

  test("bulkMake method using count > 1", () => {
    let models = StubModel.factory().count(2).bulkMake();

    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(uuidValidate(models[1].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(2);

    const id1 = chance.guid({ version: 4 });
    const id2 = chance.guid({ version: 4 });
    models = StubModel.factory()
      .count(2)
      .bulkMake((index) => ({
        id: index % 2 === 0 ? id1 : id2,
        name: "Movie",
      }));
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(uuidValidate(models[1].id)).toBeTruthy();
    expect(models[0].id).toBe(id1);
    expect(models[1].id).toBe(id2);
    expect(models[0].name).toBe("Movie");
    expect(models[1].name).toBe("Movie");
  });
});
