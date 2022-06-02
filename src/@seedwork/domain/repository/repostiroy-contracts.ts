import Entity from "../enity/entity";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<Array<E>>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchParams,
  SearchResult
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchResult>;
}
