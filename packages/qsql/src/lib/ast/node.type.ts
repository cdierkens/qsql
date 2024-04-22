export interface IdentifierNode {
  type: 'Identifier';
  value: string;
}

export interface PropertyNode {
  type: 'Property';
  key: IdentifierNode;
  value: ArrayNode | LiteralNode | ObjectNode;
}

export interface ArrayNode {
  type: 'Array';
  children: Array<ArrayNode | LiteralNode | ObjectNode>;
}

export interface ObjectNode {
  type: 'Object';
  children: Array<PropertyNode>;
}

export interface LiteralNode {
  type: 'Literal';
  value: boolean | string | number;
}

export type Node = IdentifierNode | PropertyNode | ArrayNode | LiteralNode | ObjectNode;
