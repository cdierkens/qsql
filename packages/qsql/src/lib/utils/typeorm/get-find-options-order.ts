import { FindOptionsOrder } from 'typeorm';
import { OrderQuery } from '../../types/order-query.type';

export function getFindOptionsOrder<T>(order: OrderQuery<T>): FindOptionsOrder<T> {
  return order as FindOptionsOrder<T>;
}
/**
 * @deprecated Use typeorm.getFindOptionsOrder
 */
export const getFindOptionsOrderDeprecated = getFindOptionsOrder;
