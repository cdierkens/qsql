import { evaluate } from '../ast/ast.evaluate';
import { WhereQuery } from '../types/where-query.type';
import { tokenize } from './filter-expression.lexer';
import { parse } from './filter-expression.parser';

// TODO: Document and supply examples
type FilterExpression = string;

export function toWhereQuery<T = unknown>(filterExpression: FilterExpression): WhereQuery<T> {
  return evaluate(parse(tokenize(filterExpression))) as WhereQuery<T>;
}
