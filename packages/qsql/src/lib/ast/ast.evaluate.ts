import { ArrayNode, IdentifierNode, LiteralNode, Node, ObjectNode } from './node.type';

function throwUnhandledTypeError(node: Node) {
  throw new Error(`Unhandled node type ${node.type}.`);
}

export function evaluate(node: LiteralNode): LiteralNode['value'];
export function evaluate(node: IdentifierNode): IdentifierNode['value'];
export function evaluate(node: ArrayNode): Array<Array<LiteralNode['value']> | LiteralNode['value']>;
export function evaluate(node: ObjectNode): Record<string, unknown>;
export function evaluate(node: Node) {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Array':
      return node.children.map(child => {
        switch (child.type) {
          case 'Array':
            return evaluate(child);
          case 'Literal':
            return evaluate(child);
          case 'Object':
            return evaluate(child);
          default:
            throwUnhandledTypeError(child);
            return;
        }
      });

    case 'Identifier':
      return node.value;

    case 'Object': {
      const object: Record<string, unknown> = {};

      node.children.forEach(child => {
        switch (child.value.type) {
          case 'Array':
            return (object[evaluate(child.key)] = evaluate(child.value));
          case 'Literal':
            return (object[evaluate(child.key)] = evaluate(child.value));
          case 'Object':
            return (object[evaluate(child.key)] = evaluate(child.value));
          default:
            throwUnhandledTypeError(child.value);
            return;
        }
      });

      return object;
    }

    case 'Property':
      throw new Error('Cannot evaluate object property outside of an object.');

    default:
      throwUnhandledTypeError(node);
      return;
  }
}
