import { compile } from 'moo';
import { evaluate } from '../ast/ast.evaluate';
import { ObjectNode, PropertyNode } from '../ast/node.type';
import { OrderQuery } from '../types/order-query.type';
import { Token } from '../types/token.type';
import { getNextToken } from '../utils/parse';
import { isIdentifierRegex } from '../utils/regex';

type OrderExpression = string;

const lexer = compile({
  Direction: '-',
  Identifier: isIdentifierRegex,
  Comma: ',',
});

function tokenize(orderExpression: OrderExpression): Array<Token> {
  return Array.from(lexer.reset(orderExpression))
    .filter(token => {
      return typeof token.type !== 'undefined';
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

function getProperty(tokens: Array<Token>): PropertyNode {
  let direction: Token | undefined;

  if (tokens[0] && tokens[0].type === 'Direction') {
    direction = tokens.shift();
  }

  const identifier = getNextToken(tokens, 'Identifier');
  return {
    type: 'Property',
    key: { type: 'Identifier', value: identifier.value },
    value: {
      type: 'Literal',
      value: direction ? 'desc' : 'asc',
    },
  };
}

function parse(tokens: Array<Token>) {
  const result: ObjectNode = {
    type: 'Object',
    children: [],
  };

  while (tokens.length) {
    const property = getProperty(tokens);

    if (property) {
      result.children.push(property);
    } else {
      break;
    }

    if (tokens.length) {
      getNextToken(tokens, 'Comma');
    }
  }

  return result;
}

export function toOrderQuery<T = unknown>(orderExpression: OrderExpression): OrderQuery<T> {
  return evaluate(parse(tokenize(orderExpression))) as OrderQuery<T>;
}
