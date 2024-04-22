import { Sort } from 'mongodb';
import { OrderQuery } from '../../types/order-query.type';

function getSortValue(value: 'asc' | 'desc'): 1 | -1 {
  if (value === 'asc') {
    return 1;
  }

  if (value === 'desc') {
    return -1;
  }

  throw new Error(`Unsupported sort value ${value}.`);
}

export function getSort<T>(query: OrderQuery<T>): Sort {
  const sort: Sort = {};

  for (const key in query) {
    const value = query[key];

    if (isAscOrDesc(value)) {
      sort[key] = getSortValue(value);
      continue;
    }

    if (typeof value === 'object') {
      for (const childKey in value) {
        const childValue = value[childKey];

        if (isAscOrDesc(childValue)) {
          sort[`${key}.${childKey}`] = getSortValue(childValue);
          continue;
        }

        if (typeof childValue === 'object') {
          throw new Error('OrderQuery supports 1 level of nesting.');
        }
      }
    }
  }

  return sort;
}

function isAscOrDesc(value: unknown): value is 'asc' | 'desc' {
  return value === 'asc' || value === 'desc';
}
