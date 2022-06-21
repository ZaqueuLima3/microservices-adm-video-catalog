import { validate } from "uuid";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";

type Props = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<Props> {}
describe("Entiyt Unit Tests", () => {
  it("should set props and id", () => {
    const arrange = { prop1: "new value", prop2: 5 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
  });

  it("should set a valid uuid when the id is not passed", () => {
    const arrange = { prop1: "new value", prop2: 5 };
    const entity = new StubEntity(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).not.toBeNull();
    expect(validate(entity.id)).toBeTruthy();
  });

  it("should accept a valid uuid", () => {
    const arrange = { prop1: "new value", prop2: 5 };
    const id = "4e46bfdc-d86c-4eb0-9d21-5b8a8f057b44";
    const entity = new StubEntity(arrange, id);
    expect(entity.id).toBe(id);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
  });

  it("should conver a entity to JavaScript Object", () => {
    const arrange = { prop1: "new value", prop2: 5 };
    const id = "4e46bfdc-d86c-4eb0-9d21-5b8a8f057b44";
    const expected = {
      id,
      ...arrange,
    };
    const entity = new StubEntity(arrange, id);
    expect(entity.toJSON()).toStrictEqual(expected);
  });
});
