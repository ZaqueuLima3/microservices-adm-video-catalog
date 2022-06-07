import Entity from "../../enity/entity";
import NotFoundError from "../../errors/not-found.error";
import UniqueEntityId from "../../value-objects/unique-entity-id.vo";
import { InMemoryRepository } from "./../in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepositorty Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should insert a new entity", async () => {
    const entity = new StubEntity({ name: "value", price: 5 });
    await repository.insert(entity);
    expect(repository.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should throws error when entity not found", () => {
    let id: string | UniqueEntityId = "invalid_id";
    expect(repository.findById(id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${id}`)
    );

    id = new UniqueEntityId();
    expect(repository.findById(id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${id}`)
    );
  });

  it("should funds a entity by id", async () => {
    const entity = new StubEntity({ name: "value", price: 5 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("shoudl returns all entities", async () => {
    const entity = new StubEntity({ name: "value", price: 5 });
    await repository.insert(entity);
    const entities = await repository.findAll();

    expect(entities).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", () => {
    const entity = new StubEntity({ name: "value", price: 5 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "value", price: 5 });
    await repository.insert(entity);
    const entityUpdated = new StubEntity(
      { name: "updated", price: 1 },
      entity.id
    );

    await repository.update(entityUpdated);
    expect(repository.items[0].toJSON).toStrictEqual(entityUpdated.toJSON);
  });

  it("should throws error on delete when entity not found", () => {
    let id: string | UniqueEntityId = "invalid_id";
    expect(repository.delete(id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${id}`)
    );

    id = new UniqueEntityId();
    expect(repository.delete(id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${id}`)
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "value", price: 5 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);

    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
