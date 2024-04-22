import { ArrayNode, LiteralNode, ObjectNode, PropertyNode } from '../ast/node.type';
import { Token } from '../types/token.type';
import { createSyntaxError, getNextToken, isPrimitive } from '../utils/parse';

export function parse(tokens: Token[]): ObjectNode {
  const abstractSyntaxTree: ObjectNode = {
    type: 'Object',
    children: [],
  };

  if (tokens.length === 0) {
    return abstractSyntaxTree;
  }

  const property = getProperty(tokens, abstractSyntaxTree);

  if (property) {
    abstractSyntaxTree.children.push(property);
  }

  while (tokens[0] && tokens[0].type === 'Comma') {
    tokens.shift();

    const property = getProperty(tokens, abstractSyntaxTree);

    if (property) {
      abstractSyntaxTree.children.push(property);
    }
  }

  return abstractSyntaxTree;
}

function getProperty(tokens: Array<Token>, root: ObjectNode): PropertyNode | undefined {
  const identifier = getNextToken(tokens, 'Identifier');

  if (identifier.value.includes('.')) {
    const [key, childKey] = identifier.value.split('.');

    if (!key || !childKey) {
      throw new Error('Unexpected error attempting to split key on dot(".").');
    }

    getNextToken(tokens, 'LeftParenthesis');
    const operator = getNextToken(tokens, 'Operator');
    getNextToken(tokens, 'LeftParenthesis');

    const value = getPropertyValue(tokens, operator);

    getNextToken(tokens, 'RightParenthesis');
    getNextToken(tokens, 'RightParenthesis');

    const existing = root.children.find(child => {
      return child.key.value === key;
    });

    if (existing && existing.value.type === 'Object') {
      existing.value.children.push({
        type: 'Property',
        key: { type: 'Identifier', value: childKey },
        value,
      });

      return;
    }

    return {
      type: 'Property',
      key: { type: 'Identifier', value: key },
      value: {
        type: 'Object',
        children: [
          {
            type: 'Property',
            key: { type: 'Identifier', value: childKey },
            value,
          },
        ],
      },
    };
  }

  getNextToken(tokens, 'LeftParenthesis');
  const operator = getNextToken(tokens, 'Operator');
  getNextToken(tokens, 'LeftParenthesis');

  const value = getPropertyValue(tokens, operator);

  getNextToken(tokens, 'RightParenthesis');
  getNextToken(tokens, 'RightParenthesis');

  return {
    type: 'Property',
    key: { type: 'Identifier', value: identifier.value },
    value,
  };
}

function getPropertyValue(tokens: Array<Token>, operator: Token): ArrayNode {
  if (['lt', 'lte', 'eq', 'gt', 'gte'].includes(operator.value)) {
    const value = tokens.shift();

    if (!value) {
      throw new Error(`Missing input: Expected "Number", "String", or "Boolean" in expression.`);
    }
    if (!isPrimitive(value)) {
      throw createSyntaxError(`Expected type "${value.type}" to be "Number", "String", or "Boolean"`, value);
    }

    return {
      type: 'Array',
      children: [
        { type: 'Literal', value: operator.value },
        { type: 'Literal', value: value.value },
      ],
    };
  } else if (['in', 'between'].includes(operator.value)) {
    const children = getChildren(tokens);

    if (operator.value === 'between' && children.length > 2) {
      throw new SyntaxError(`Expected values "${JSON.stringify(children)}" to have two entries`);
    }

    return {
      type: 'Array',
      children: [
        { type: 'Literal', value: operator.value },
        { type: 'Array', children },
      ],
    };
  } else if (operator.value === 'not') {
    const operator = getNextToken(tokens, 'Operator');

    getNextToken(tokens, 'LeftParenthesis');
    const propertyValue = getPropertyValue(tokens, operator);
    getNextToken(tokens, 'RightParenthesis');

    return {
      type: 'Array',
      children: [{ type: 'Literal', value: 'not' }, propertyValue],
    };
  } else if (operator.value === 'isNull') {
    return {
      type: 'Array',
      children: [{ type: 'Literal', value: 'isNull' }],
    };
  } else {
    throw new SyntaxError(
      `Expected operator "${operator.value}" to be "lt", "lte", "eq", "gt", "gte", "in", "between", "isNull", or "not"`
    );
  }
}
function getChildren(tokens: Token[]): Array<LiteralNode> {
  const children: Array<LiteralNode> = [];
  let token = tokens.shift();

  if (!token) {
    throw new Error(`Out of bounds exception: Expected "Number", "String", or "Boolean" before expression end.`);
  }

  if (!isPrimitive(token)) {
    throw new SyntaxError(`Expected type "${token.type}" to be "Number", "String", or "Boolean"`);
  }

  children.push({
    type: 'Literal',
    value: token.value,
  });

  while (tokens[0] && tokens[0].type === 'Comma') {
    // Throw away the comma
    tokens.shift();
    token = tokens.shift();

    if (!token) {
      throw new Error(`Out of bounds exception: Expected "Number", "String", or "Boolean" before expression end.`);
    }

    if (!isPrimitive(token)) {
      throw new SyntaxError(`Expected type "${token.type}" to be "Number", "String", or "Boolean"`);
    }

    children.push({
      type: 'Literal',
      value: token.value,
    });
  }

  return children;
}
