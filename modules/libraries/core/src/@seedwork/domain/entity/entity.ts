import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export abstract class Entity<Props = any> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, id?: string) {
    this.uniqueEntityId = new UniqueEntityId(id);
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}

export default Entity;
