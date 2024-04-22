import { FilterOperators } from 'mongodb';
import { isWhereQuery, WhereQuery, WhereQueryProperty } from '../../types/where-query.type';

export type Filter<T> =
  | {
      [Key in keyof T]?: FilterOperators<T[Key]>;
    }
  | {
      [key: string]: unknown;
    };

export function LessThan<T>(value: T) {
  return { $lt: value };
}

export function LessThanOrEqual<T>(value: T) {
  return { $lte: value };
}

export function MoreThan<T>(value: T) {
  return { $gt: value };
}

export function MoreThanOrEqual<T>(value: T) {
  return { $gte: value };
}

export function Equal<T>(value: T) {
  return { $eq: value };
}

export function In<T>(values: ReadonlyArray<T>) {
  return { $in: values };
}

export function Between<T>(min: T, max: T) {
  return { $gte: min, $lte: max };
}

export function Not<T>(operator: FilterOperators<T>) {
  return { $not: operator };
}

export function IsNull() {
  return { eq: null };
}

function getFilterOperator<T>(candidate: WhereQueryProperty<T>): FilterOperators<T> {
  const [operator, value] = candidate;

  switch (operator) {
    case 'lt': {
      return LessThan(value);
    }
    case 'lte': {
      return LessThanOrEqual(value);
    }
    case 'gt': {
      return MoreThan(value);
    }
    case 'gte': {
      return MoreThanOrEqual(value);
    }
    case 'eq': {
      return Equal(value);
    }
    case 'in': {
      return In(value);
    }
    case 'between': {
      const [min, max] = value;
      return Between(min, max);
    }
    case 'not': {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return Not(getFilterOperator(value));
    }
    case 'isNull': {
      return IsNull();
    }
    default: {
      throw new Error(`Unsupported operator "${operator}"`);
    }
  }
}

export function getFilterOperators<T>(query: WhereQuery<T>): FilterOperators<T> {
  const filterOperators: FilterOperators<T> = {};

  for (const key in query) {
    const value = query[key];

    if (Array.isArray(value)) {
      filterOperators[key] = getFilterOperator(value as WhereQueryProperty<T[keyof T]>);

      continue;
    }

    if (isWhereQuery(value)) {
      for (const childKey in value) {
        const childValue = value[childKey] as WhereQueryProperty<T[keyof T]>;

        filterOperators[`${key}.${childKey}`] = getFilterOperator(childValue);
      }

      continue;
    }
  }

  return filterOperators;
}
