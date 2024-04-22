import { OrderQuery } from "./order-query.type";
import { WhereQuery } from "./where-query.type";

export interface Query<T> {
  relations?: { [Key in keyof T]?: boolean };
  order?: OrderQuery<T>;
  page?: number;
  perPage?: number;
  where?: WhereQuery<T>;
  withDeleted?: boolean;
}
