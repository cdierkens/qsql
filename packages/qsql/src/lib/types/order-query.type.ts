import { z } from 'zod';

export type OrderQueryProperty<Entity, Property extends keyof Entity> = 'asc' | 'desc' | OrderQuery<Entity[Property]>;

export type OrderQuery<Entity> = {
  [Property in keyof Entity]?: OrderQueryProperty<Entity, Property>;
};

const OrderQuerySchema = z.record(z.union([z.literal('asc'), z.literal('desc')]));
const RootOrderQuerySchema = z.record(z.union([z.literal('asc'), z.literal('desc'), OrderQuerySchema]));

export const parseOrderQuery = RootOrderQuerySchema.parse;
export const safeParseOrderQuery = RootOrderQuerySchema.safeParse;

export function isOrderQuery<T>(value?: OrderQuery<T>): value is OrderQuery<T> {
  return typeof value === 'object';
}
