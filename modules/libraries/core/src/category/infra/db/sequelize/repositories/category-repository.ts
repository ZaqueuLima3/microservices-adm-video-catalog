import { Category, CategoryRepository } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { Op, Order } from "sequelize";
import { CategoryModelMapper } from "../mappers";
import { CategoryModel } from "../models";

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  searchableField: string[] = ["name", "created_at"];
  items: Category[];

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(
    props: CategoryRepository.SearchParams
  ): Promise<CategoryRepository.SearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const where = props.filter && { name: { [Op.like]: `%${props.filter}%` } };
    const order: Order =
      props.sort && this.searchableField.includes(props.sort)
        ? [[props.sort, props.sort_dir]]
        : [["created_at", "DESC"]];

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
    });

    return new CategoryRepository.SearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
    });
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJSON());
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const model = await this._get(id.toString());
    return CategoryModelMapper.toEntity(model);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  async update(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async _get(id: string): Promise<CategoryModel> {
    return this.categoryModel.findByPk(id.toString(), {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
    });
  }
}
