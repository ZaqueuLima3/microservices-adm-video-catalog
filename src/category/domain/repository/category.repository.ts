import { SearchableRepositoryInterface } from "../../../@seedwork/domain/repository/repostiroy-contracts";
import Category from "../entities/category";

export default interface CategoryRepository
  extends SearchableRepositoryInterface<Category, any, any> {}
