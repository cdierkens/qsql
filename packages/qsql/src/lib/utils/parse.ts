import { Token } from '../types/token.type';

export function ensureToken(token: Token | undefined, type: string) {
  if (!token) {
    throw new Error(`Out of bounds exception: Expected "${type}" before expression end.`);
  }
  if (token.type !== type) {
    throw createExpressionError(type, token);
  }
  return token;
}

export function getNextToken(tokens: Token[], type: string) {
  const token = tokens.shift();
  return ensureToken(token, type);
}

export function isPrimitive(token?: Token) {
  return Boolean(token && (token.type === 'Number' || token.type === 'String' || token.type === 'Boolean'));
}

export function createExpressionError(expectedType: string, token: Token) {
  return createSyntaxError(`Expected type "${token.type}" to be "${expectedType}"`, token);
}

export function createSyntaxError(message: string, token: Token) {
  return new SyntaxError(`Error at character ${token.col}. ${message}`);
}
