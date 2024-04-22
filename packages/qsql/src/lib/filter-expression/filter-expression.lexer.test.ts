import { tokenize } from "./filter-expression.lexer";
import { describe, it, expect, test } from "vitest";

describe("FilterExpressionLexer", () => {
  it("should return an array", () => {
    expect(tokenize("")).toEqual([]);
  });

  describe("numbers", () => {
    it("should tokenize positive integers", () => {
      expect(tokenize("1,56879429678250")).toEqual([
        {
          col: expect.any(Number),
          raw: "1",
          type: "Number",
          value: 1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "56879429678250",
          type: "Number",
          value: 56879429678250,
        },
      ]);
    });

    it("should tokenize negative integers", () => {
      expect(tokenize("-1,-1982726")).toEqual([
        {
          col: expect.any(Number),
          raw: "-1",
          type: "Number",
          value: -1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "-1982726",
          type: "Number",
          value: -1982726,
        },
      ]);
    });

    it("should tokenize positive decimals", () => {
      expect(tokenize(".1,1.1,1001.1,1234.5678")).toEqual([
        {
          col: expect.any(Number),
          raw: ".1",
          type: "Number",
          value: 0.1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "1.1",
          type: "Number",
          value: 1.1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "1001.1",
          type: "Number",
          value: 1001.1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "1234.5678",
          type: "Number",
          value: 1234.5678,
        },
      ]);
    });

    it("should tokenize negative decimals", () => {
      expect(tokenize("-.1,-1.1,-1001.1,-1234.5678")).toEqual([
        {
          col: expect.any(Number),
          raw: "-.1",
          type: "Number",
          value: -0.1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "-1.1",
          type: "Number",
          value: -1.1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "-1001.1",
          type: "Number",
          value: -1001.1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "-1234.5678",
          type: "Number",
          value: -1234.5678,
        },
      ]);
    });
  });
  describe("strings", () => {
    it("should tokenize anything within single quotes", () => {
      expect(
        tokenize(`'anything within single quotes','.!@#$%^&*()','100','"cool"'`)
      ).toEqual([
        {
          col: expect.any(Number),
          raw: "'anything within single quotes'",
          type: "String",
          value: "anything within single quotes",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "'.!@#$%^&*()'",
          type: "String",
          value: ".!@#$%^&*()",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "'100'",
          type: "String",
          value: "100",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "'\"cool\"'",
          type: "String",
          value: '"cool"',
        },
      ]);
    });
    it("should identified as strings when they have dot notation", () => {
      expect(tokenize(`'my.key'`)).toEqual([
        {
          col: expect.any(Number),
          raw: `'my.key'`,
          type: "String",
          value: "my.key",
        },
      ]);
    });
  });

  describe("booleans", () => {
    it("should tokenize booleans", () => {
      expect(tokenize(`true,false`)).toEqual([
        {
          col: expect.any(Number),
          raw: "true",
          type: "Boolean",
          value: true,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "false",
          type: "Boolean",
          value: false,
        },
      ]);
    });
  });

  describe("operators", () => {
    it("should tokenize operators", () => {
      expect(tokenize(`lt,lte,gt,gte,eq,in,between,not,isNull`)).toEqual([
        {
          col: expect.any(Number),
          raw: "lt",
          type: "Operator",
          value: "lt",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "lte",
          type: "Operator",
          value: "lte",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "gt",
          type: "Operator",
          value: "gt",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "gte",
          type: "Operator",
          value: "gte",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "eq",
          type: "Operator",
          value: "eq",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "in",
          type: "Operator",
          value: "in",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "between",
          type: "Operator",
          value: "between",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "not",
          type: "Operator",
          value: "not",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "isNull",
          type: "Operator",
          value: "isNull",
        },
      ]);
    });
  });

  describe("identifiers", () => {
    it("should tokenize identifiers", () => {
      expect(tokenize("key,my_key1")).toEqual([
        {
          col: expect.any(Number),
          raw: "key",
          type: "Identifier",
          value: "key",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "my_key1",
          type: "Identifier",
          value: "my_key1",
        },
      ]);
    });
    it("should support dot notation", () => {
      expect(tokenize("my.key")).toEqual([
        {
          col: expect.any(Number),
          raw: "my.key",
          type: "Identifier",
          value: "my.key",
        },
      ]);
    });
  });

  describe("parentheses", () => {
    it("should tokenize left parentheses", () => {
      expect(tokenize("(")).toEqual([
        {
          col: expect.any(Number),
          raw: "(",
          type: "LeftParenthesis",
          value: "(",
        },
      ]);
    });

    it("should tokenize right parentheses", () => {
      expect(tokenize(")")).toEqual([
        {
          col: expect.any(Number),
          raw: ")",
          type: "RightParenthesis",
          value: ")",
        },
      ]);
    });
  });

  describe("commas", () => {
    it("should tokenize commas", () => {
      expect(tokenize(",")).toEqual([
        {
          col: expect.any(Number),
          raw: ",",
          type: "Comma",
          value: ",",
        },
      ]);
    });
  });

  describe("combinations", () => {
    it("should handle an operator with an identifier and a number", () => {
      expect(tokenize("gt(k1, 1)")).toEqual([
        {
          col: expect.any(Number),
          raw: "gt",
          type: "Operator",
          value: "gt",
        },
        {
          col: expect.any(Number),
          raw: "(",
          type: "LeftParenthesis",
          value: "(",
        },
        {
          col: expect.any(Number),
          raw: "k1",
          type: "Identifier",
          value: "k1",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "1",
          type: "Number",
          value: 1,
        },
        {
          col: expect.any(Number),
          raw: ")",
          type: "RightParenthesis",
          value: ")",
        },
      ]);
    });

    it("should handle an operator with an identifier and a string", () => {
      expect(tokenize(`eq(key, 'ten')`)).toEqual([
        {
          col: expect.any(Number),
          raw: "eq",
          type: "Operator",
          value: "eq",
        },
        {
          col: expect.any(Number),
          raw: "(",
          type: "LeftParenthesis",
          value: "(",
        },
        {
          col: expect.any(Number),
          raw: "key",
          type: "Identifier",
          value: "key",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "'ten'",
          type: "String",
          value: "ten",
        },
        {
          col: expect.any(Number),
          raw: ")",
          type: "RightParenthesis",
          value: ")",
        },
      ]);
    });

    it("should handle an operator with an identifier and an array", () => {
      expect(tokenize(`in(key, (1, 'two', true))`)).toEqual([
        {
          col: expect.any(Number),
          raw: "in",
          type: "Operator",
          value: "in",
        },
        {
          col: expect.any(Number),
          raw: "(",
          type: "LeftParenthesis",
          value: "(",
        },
        {
          col: expect.any(Number),
          raw: "key",
          type: "Identifier",
          value: "key",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "(",
          type: "LeftParenthesis",
          value: "(",
        },
        {
          col: expect.any(Number),
          raw: "1",
          type: "Number",
          value: 1,
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "'two'",
          type: "String",
          value: "two",
        },
        expect.objectContaining({
          type: "Comma",
        }),
        {
          col: expect.any(Number),
          raw: "true",
          type: "Boolean",
          value: true,
        },
        {
          col: expect.any(Number),
          raw: ")",
          type: "RightParenthesis",
          value: ")",
        },
        {
          col: expect.any(Number),
          raw: ")",
          type: "RightParenthesis",
          value: ")",
        },
      ]);
    });
  });

  describe("white space", () => {
    it("should filter out spaces and tabs", () => {
      expect(tokenize("   ,   ,\t  ,")).toEqual([
        expect.objectContaining({
          type: "Comma",
        }),
        expect.objectContaining({
          type: "Comma",
        }),
        expect.objectContaining({
          type: "Comma",
        }),
      ]);
    });
  });
});
