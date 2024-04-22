import {
  Between,
  Equal,
  FindOperator,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { WhereQuery, WhereQueryProperty } from '../../types/where-query.type';

function getFindOperator<T>(candidate: WhereQuery<T[keyof T]>): FindOptionsWhere<T[keyof T]>;
function getFindOperator<T>(candidate: WhereQueryProperty<T>): FindOperator<T>;
function getFindOperator<T>(
  candidate: WhereQueryProperty<T> | WhereQuery<T[keyof T]>
): FindOperator<T> | FindOptionsWhere<T[keyof T]> {
  if (!Array.isArray(candidate)) {
    return getFindOptionsWhere(candidate);
  }
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
    case 'between': {
      const [from, to] = value;

      return Between(from, to);
    }
    case 'not': {
      return Not(getFindOperator(value));
    }
    case 'in': {
      return In(value);
    }
    case 'isNull': {
      return IsNull();
    }
    default: {
      throw new Error(`Unknowns operator ${operator}`);
    }
  }
}

function isWhereQuery<T>(value?: WhereQuery<T>): value is WhereQuery<T> {
  return typeof value === 'object';
}

export function getFindOptionsWhere<T>(query: WhereQuery<T>): FindOptionsWhere<T> {
  const findOptionsWhere: FindOptionsWhere<T> = {};

  for (const key in query) {
    const value = query[key as keyof T];

    if (Array.isArray(value) || isWhereQuery(value)) {
      findOptionsWhere[key] = getFindOperator(value) as typeof key extends 'toString'
        ? unknown
        : FindOptionsWhereProperty<NonNullable<T[Extract<keyof T, string>]>, NonNullable<T[Extract<keyof T, string>]>>;
    }
  }

  return findOptionsWhere;
}

/**
 * @deprecated Use typeorm.getFindOptionsWhere
 */
export const getFindOptionsWhereDeprecated = getFindOptionsWhere;
