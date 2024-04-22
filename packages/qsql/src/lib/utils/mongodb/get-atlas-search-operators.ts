import { isWhereQuery, WhereQuery, WhereQueryProperty } from '../../types/where-query.type';

type Filter<T> =
  | {
      range: { path: string; lt?: T; gt?: T; lte?: T; gte?: T };
    }
  | { equals: { path: string; value: T } }
  | { in: { path: string; value: readonly T[] } }
  | { exists: { path: string } }
  | { text: { path: string; query: readonly string[] } };

export type AtlasSearchFilter = {
  must: Filter<unknown>[];
  mustNot: Filter<unknown>[];
};

export function LessThan<T>(path: string, value: T) {
  return { range: { path, lt: value } };
}

export function LessThanOrEqual<T>(path: string, value: T) {
  return { range: { path, lte: value } };
}

export function MoreThan<T>(path: string, value: T) {
  return { range: { path, gt: value } };
}

export function MoreThanOrEqual<T>(path: string, value: T) {
  return { range: { path, gte: value } };
}

export function Equal<T>(path: string, value: T) {
  return { equals: { path, value } };
}

export function In<T>(path: string, values: ReadonlyArray<T>) {
  if (typeof values[0] === 'string') {
    return { text: { path, query: values as readonly string[] } };
  }
  return { in: { path, value: values } };
}

export function Between<T>(path: string, min: T, max: T) {
  return {
    range: {
      path,
      gte: min,
      lte: max,
    },
  };
}

export function Exists(path: string) {
  return { exists: { path } };
}

function getOperator<T>(
  path: string,
  candidate: WhereQueryProperty<T>
): { filter: Filter<T>; type: 'must' | 'mustNot' } {
  const [operator, value] = candidate;

  switch (operator) {
    case 'lt': {
      return { filter: LessThan(path, value), type: 'must' };
    }
    case 'lte': {
      return { filter: LessThanOrEqual(path, value), type: 'must' };
    }
    case 'gt': {
      return { filter: MoreThan(path, value), type: 'must' };
    }
    case 'gte': {
      return { filter: MoreThanOrEqual(path, value), type: 'must' };
    }
    case 'eq': {
      return { filter: Equal(path, value), type: 'must' };
    }
    case 'in': {
      return { filter: In(path, value), type: 'must' };
    }
    case 'between': {
      const [min, max] = value;
      return { filter: Between(path, min, max), type: 'must' };
    }
    case 'not': {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return { filter: getOperator(path, value).filter, type: 'mustNot' };
    }
    case 'isNull': {
      return { filter: Exists(path), type: 'mustNot' };
    }
    default: {
      throw new Error(`Unsupported operator "${operator}"`);
    }
  }
}

export function getAtlasSearchOperators<T>(query: WhereQuery<T>): AtlasSearchFilter {
  const filterOperators: AtlasSearchFilter = {
    must: [],
    mustNot: [],
  };

  for (const key in query) {
    const value = query[key];

    if (Array.isArray(value)) {
      const { filter, type } = getOperator(key, value as WhereQueryProperty<T[keyof T]>);
      filterOperators[type].push(filter);
    } else if (isWhereQuery(value)) {
      for (const childKey in value) {
        const { filter, type } = getOperator(`${key}.${childKey}`, value[childKey] as WhereQueryProperty<T[keyof T]>);
        filterOperators[type].push(filter);
      }
    }
  }

  return filterOperators;
}
