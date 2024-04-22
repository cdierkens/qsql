import { getFindOptionsOrder } from "./get-find-options-order";
import { getFindOptionsWhere } from "./get-find-options-where";

export const typeorm = { getFindOptionsOrder, getFindOptionsWhere };

/**
 * @deprecated Use `typeorm.getFindOptionsOrder`
 *
 *  * @example
 * ```ts
 * import { typeorm } from "qsql"
 *
 * const findOptionsOrder = typeorm.getFindOptionsOrder({ id: "asc" })
 * ```
 */
const _getFindOptionsOrder = getFindOptionsOrder;

/**
 * @deprecated Use `typeorm.getFindOptionsWhere`
 *
 * @example
 * ```ts
 * import { typeorm } from "qsql"
 *
 * const findOptionsWhere = typeorm.getFindOptionsWhere({ id: ["eq", 1] })
 * ```
 */
const _getFindOptionsWhere = getFindOptionsWhere;

export {
  _getFindOptionsOrder as getFindOptionsOrder,
  _getFindOptionsWhere as getFindOptionsWhere,
};
