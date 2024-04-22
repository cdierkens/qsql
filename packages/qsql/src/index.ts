import { getAtlasSearchOperators } from "./lib/utils/mongodb/get-atlas-search-operators";
import { getFilterOperators } from "./lib/utils/mongodb/get-filter-operators";
import { getSort } from "./lib/utils/mongodb/get-sort";
import { getFindOptionsOrder } from "./lib/utils/typeorm/get-find-options-order";
import { getFindOptionsWhere } from "./lib/utils/typeorm/get-find-options-where";

export { toWhereQuery } from "./lib/filter-expression/filter-expression";
export { toOrderQuery } from "./lib/order-expression/order-expression";
export {
  parseOrderQuery,
  safeParseOrderQuery,
} from "./lib/types/order-query.type";
export type { OrderQuery } from "./lib/types/order-query.type";
export type { Query, Query } from "./lib/types/query.type";
export {
  parseWhereQuery,
  safeParseWhereQuery,
} from "./lib/types/where-query.type";
export type {
  Operator,
  OperatorValueTuple,
  WhereQuery,
} from "./lib/types/where-query.type";
export { getFindOptionsOrder, getFindOptionsWhere } from "./lib/utils/typeorm";

export const typeorm = { getFindOptionsOrder, getFindOptionsWhere };
export const mongodb = { getFilterOperators, getSort, getAtlasSearchOperators };
