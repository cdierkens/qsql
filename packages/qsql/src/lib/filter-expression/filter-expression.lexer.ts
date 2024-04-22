import { compile } from 'moo';
import { Token } from '../types/token.type';

// TODO: Document and supply examples
type FilterExpression = string;

const lexer = compile({
  Number: { match: /[-+]?(?:[0-9]*\.[0-9]+|[0-9]+)/, value: raw => parseFloat(raw) as unknown as string },
  String: { match: /'.*?'/, value: raw => raw.slice(1, -1) },
  Boolean: { match: ['true', 'false'], value: raw => (raw === 'true' ? true : false) as unknown as string },
  Operator: ['lt', 'lte', 'gt', 'gte', 'eq', 'in', 'between', 'not', 'isNull'],
  // https://regex101.com/r/YKVVrJ/2
  Identifier: { match: /(?:(?:[a-zA-Z][\w$]*){1}\.?)+/, value: raw => raw.trim() },
  LeftParenthesis: '(',
  RightParenthesis: ')',
  Comma: ',',
  WhiteSpace: /[ \t]+/,
});

export function tokenize(filterExpression: FilterExpression): Array<Token> {
  return Array.from(lexer.reset(filterExpression))
    .filter(token => {
      return token.type !== 'WhiteSpace' && typeof token.type !== 'undefined';
    })
    .map(({ col, type, text: raw, value }) => {
      if (typeof type === 'undefined') {
        throw new Error("Unexpected error: 'undefined' token type");
      }

      return {
        col,
        type,
        raw,
        value,
      };
    });
}
