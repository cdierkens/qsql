import { isValid, parseISO } from 'date-fns';
import { z } from 'zod';
import { isIsoDateRegex } from '../utils/regex';

export type Operator = 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'in' | 'between' | 'not';

export type OperatorValueTuple<Value> =
  | ['between', [Value, Value]]
  | ['in', Array<Value>]
  | ['lt', Value]
  | ['lte', Value]
  | ['gt', Value]
  | ['gte', Value]
  | ['eq', Value]
  | ['isNull'];

const ValueSchema = z.union([z.string(), z.number(), z.boolean(), z.date()]);

const OperatorValueTupleSchema = z.union([
  z.tuple([z.literal('between'), z.tuple([ValueSchema, ValueSchema])]),
  z.tuple([z.literal('in'), z.array(ValueSchema)]),
  z.tuple([z.literal('lt'), ValueSchema]),
  z.tuple([z.literal('lte'), ValueSchema]),
  z.tuple([z.literal('gt'), ValueSchema]),
  z.tuple([z.literal('gte'), ValueSchema]),
  z.tuple([z.literal('eq'), ValueSchema]),
  z.tuple([z.literal('isNull')]),
]);

export type WhereQueryProperty<Property> = OperatorValueTuple<Property> | ['not', OperatorValueTuple<Property>];

const WhereQueryPropertySchema = z.union([
  OperatorValueTupleSchema,
  z.tuple([z.literal('not'), OperatorValueTupleSchema]),
]);

export type WhereQuery<Entity> = {
  [Property in keyof Entity]?: WhereQueryProperty<Entity[Property]> | WhereQuery<Entity[Property]>;
};

const WhereQuerySchema = z.record(WhereQueryPropertySchema);
const RootWhereQuerySchema = z.record(z.union([WhereQueryPropertySchema, WhereQuerySchema]));

export function parseWhereQuery(data: unknown) {
  const result = RootWhereQuerySchema.parse(data);

  return convertStringsToDate(result);
}

export function safeParseWhereQuery<T>(data: T) {
  const result = RootWhereQuerySchema.safeParse(data);

  if (!result.success) {
    return result;
  }

  result.data = convertStringsToDate(result.data);

  return result;
}

function isIsoDate(value: string): boolean {
  if (!isIsoDateRegex.test(value)) {
    return false;
  }

  return isValid(parseISO(value));
}

function stringToDate<T>(value: T): T | Date {
  return typeof value === 'string' && isIsoDate(value) ? parseISO(value) : value;
}

function convertStringsToDate<T extends object>(data: T): T {
  for (const candidate of Object.values(data)) {
    if (!Array.isArray(candidate)) {
      convertStringsToDate(candidate);

      continue;
    }

    const [operator, value] = candidate;

    switch (operator) {
      case 'between': {
        const [from, to] = value;

        candidate[1] = [stringToDate(from), stringToDate(to)];
        break;
      }
      case 'not': {
        candidate[1][1] = stringToDate(candidate[1][1]);
        break;
      }
      case 'in': {
        candidate[1] = candidate[1].map((value: unknown) => stringToDate(value));
        break;
      }
      case 'isNull': {
        break;
      }
      default: {
        candidate[1] = stringToDate(candidate[1]);
      }
    }
  }

  return data;
}

export function isWhereQuery<T>(value?: WhereQuery<T>): value is WhereQuery<T> {
  return typeof value === 'object';
}
