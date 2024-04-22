import { tokenize } from "./filter-expression.lexer";
import { parse } from "./filter-expression.parser";
import { describe, it, expect, test } from "vitest";

describe("FilterExpressionParser", () => {
  it("should return an empty given an empty tokens array", () => {
    expect(parse([])).toEqual({
      children: [],
      type: "Object",
    });
  });

  test.each([
    { operator: "lt", raw: "5", value: 5 },
    { operator: "lte", raw: "5", value: 5 },
    { operator: "eq", raw: "'beans'", value: "beans" },
    { operator: "eq", raw: "true", value: true },
    { operator: "gt", raw: "5", value: 5 },
    { operator: "gte", raw: "5", value: 5 },
  ])("should support $operator", ({ operator, raw, value }) => {
    expect(parse(tokenize(`key(${operator}(${raw}))`))).toEqual({
      type: "Object",
      children: [
        {
          type: "Property",
          key: {
            type: "Identifier",
            value: "key",
          },
          value: {
            type: "Array",
            children: [
              {
                type: "Literal",
                value: operator,
              },
              {
                type: "Literal",
                value: value,
              },
            ],
          },
        },
      ],
    });
  });

  test.each([
    {
      operator: "in",
      raw: `1, 'two', true`,
      values: [1, "two", true],
    },
    {
      operator: "between",
      raw: `1, 3`,
      values: [1, 3],
    },
    {
      operator: "in",
      raw: `1, 3`,
      values: [1, 3],
    },
  ])("should support $operator", ({ operator, raw, values }) => {
    expect(parse(tokenize(`key(${operator}(${raw}))`))).toEqual({
      type: "Object",
      children: [
        {
          type: "Property",
          key: {
            type: "Identifier",
            value: "key",
          },
          value: {
            type: "Array",
            children: [
              {
                type: "Literal",
                value: operator,
              },
              {
                type: "Array",
                children: values.map((value) => ({
                  type: "Literal",
                  value,
                })),
              },
            ],
          },
        },
      ],
    });
  });

  it("should support not operator for a single value expression", () => {
    expect(parse(tokenize("key(not(eq(1)))"))).toEqual({
      type: "Object",
      children: [
        {
          key: {
            type: "Identifier",
            value: "key",
          },
          type: "Property",
          value: {
            type: "Array",
            children: [
              {
                type: "Literal",
                value: "not",
              },
              {
                type: "Array",
                children: [
                  {
                    type: "Literal",
                    value: "eq",
                  },
                  {
                    type: "Literal",
                    value: 1,
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  it("should support not operator for a multi value expression", () => {
    expect(parse(tokenize("key(not(in(1,2,3)))"))).toEqual({
      type: "Object",
      children: [
        {
          key: {
            type: "Identifier",
            value: "key",
          },
          type: "Property",
          value: {
            type: "Array",
            children: [
              {
                type: "Literal",
                value: "not",
              },
              {
                type: "Array",
                children: [
                  {
                    type: "Literal",
                    value: "in",
                  },
                  {
                    type: "Array",
                    children: [
                      {
                        type: "Literal",
                        value: 1,
                      },
                      {
                        type: "Literal",
                        value: 2,
                      },
                      {
                        type: "Literal",
                        value: 3,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  it("should support single dot notion key", () => {
    expect(parse(tokenize("key.child(eq(1))"))).toEqual({
      type: "Object",
      children: [
        {
          type: "Property",
          key: {
            type: "Identifier",
            value: "key",
          },
          value: {
            type: "Object",
            children: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  value: "child",
                },
                value: {
                  type: "Array",
                  children: [
                    {
                      type: "Literal",
                      value: "eq",
                    },
                    {
                      type: "Literal",
                      value: 1,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should support dot notion with two children on the same parent key", () => {
    expect(parse(tokenize("key.child1(eq(1)),key.child2(eq(2))"))).toEqual({
      type: "Object",
      children: [
        {
          type: "Property",
          key: {
            type: "Identifier",
            value: "key",
          },
          value: {
            type: "Object",
            children: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  value: "child1",
                },
                value: {
                  type: "Array",
                  children: [
                    {
                      type: "Literal",
                      value: "eq",
                    },
                    {
                      type: "Literal",
                      value: 1,
                    },
                  ],
                },
              },
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  value: "child2",
                },
                value: {
                  type: "Array",
                  children: [
                    {
                      type: "Literal",
                      value: "eq",
                    },
                    {
                      type: "Literal",
                      value: 2,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should support dot notion with two children key on different parent keys", () => {
    expect(parse(tokenize("key1.child1(eq(1)),key2.child2(eq(2))"))).toEqual({
      type: "Object",
      children: [
        {
          type: "Property",
          key: {
            type: "Identifier",
            value: "key1",
          },
          value: {
            type: "Object",
            children: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  value: "child1",
                },
                value: {
                  type: "Array",
                  children: [
                    {
                      type: "Literal",
                      value: "eq",
                    },
                    {
                      type: "Literal",
                      value: 1,
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: "Property",
          key: {
            type: "Identifier",
            value: "key2",
          },
          value: {
            type: "Object",
            children: [
              {
                type: "Property",
                key: {
                  type: "Identifier",
                  value: "child2",
                },
                value: {
                  type: "Array",
                  children: [
                    {
                      type: "Literal",
                      value: "eq",
                    },
                    {
                      type: "Literal",
                      value: 2,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("should support isNull operator", () => {
    expect(parse(tokenize("key(isNull())"))).toEqual({
      type: "Object",
      children: [
        {
          key: {
            type: "Identifier",
            value: "key",
          },
          type: "Property",
          value: {
            type: "Array",
            children: [
              {
                type: "Literal",
                value: "isNull",
              },
            ],
          },
        },
      ],
    });
  });

  it("should support multiple expressions", () => {
    expect(
      parse(
        tokenize(
          "key1(eq('one')),key2(in(1,2,3,4,5)),key3(not(between(true,false)))"
        )
      )
    ).toEqual({
      type: "Object",
      children: [
        {
          key: {
            type: "Identifier",
            value: "key1",
          },
          type: "Property",
          value: {
            children: [
              {
                type: "Literal",
                value: "eq",
              },
              {
                type: "Literal",
                value: "one",
              },
            ],
            type: "Array",
          },
        },
        {
          key: {
            type: "Identifier",
            value: "key2",
          },
          type: "Property",
          value: {
            children: [
              {
                type: "Literal",
                value: "in",
              },
              {
                children: [
                  {
                    type: "Literal",
                    value: 1,
                  },
                  {
                    type: "Literal",
                    value: 2,
                  },
                  {
                    type: "Literal",
                    value: 3,
                  },
                  {
                    type: "Literal",
                    value: 4,
                  },
                  {
                    type: "Literal",
                    value: 5,
                  },
                ],
                type: "Array",
              },
            ],
            type: "Array",
          },
        },
        {
          key: {
            type: "Identifier",
            value: "key3",
          },
          type: "Property",
          value: {
            type: "Array",
            children: [
              {
                type: "Literal",
                value: "not",
              },
              {
                type: "Array",
                children: [
                  {
                    type: "Literal",
                    value: "between",
                  },
                  {
                    type: "Array",
                    children: [
                      {
                        type: "Literal",
                        value: true,
                      },
                      {
                        type: "Literal",
                        value: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  describe("syntax errors", () => {
    test.each([
      {
        testName: "should throw when missing operator",
        expression: "key(('value'))",
        error:
          'Error at character 5. Expected type "LeftParenthesis" to be "Operator"',
      },
      {
        testName: "should throw when missing operator left parenthesis",
        expression: "key, eq, 'value')",
        error:
          'Error at character 4. Expected type "Comma" to be "LeftParenthesis"',
      },
      {
        testName: "should throw when identifier is a string",
        expression: "'key'(eq('value'))",
        error:
          'Error at character 1. Expected type "String" to be "Identifier"',
      },
      {
        testName:
          "should throw when passing extra values to single value operator",
        expression: "key(eq('value', 'two'))",
        error:
          'Error at character 15. Expected type "Comma" to be "RightParenthesis"',
      },
      {
        testName: "should throw when expected right parenthesis is missing",
        expression: "key(eq('value')",
        error:
          'Out of bounds exception: Expected "RightParenthesis" before expression end.',
      },
      {
        testName: "should throw when right parenthesis is missing after array",
        expression: "key(in('one','two')",
        error:
          'Out of bounds exception: Expected "RightParenthesis" before expression end.',
      },
      {
        testName: "should throw for unknown operator",
        expression: "key(unknown('value'))",
        error:
          'Error at character 5. Expected type "Identifier" to be "Operator"',
      },
    ])("$testName", ({ expression, error }) => {
      expect(() => parse(tokenize(expression))).toThrowError(error);
    });
  });
});
