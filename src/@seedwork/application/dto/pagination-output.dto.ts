export type PaginationOutput<E = any> = {
  items: E[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};
