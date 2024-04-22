import { subDays } from "date-fns";
import {
  parseWhereQuery,
  safeParseWhereQuery,
  WhereQuery,
} from "./where-query.type";
import { describe, it, expect } from "vitest";

interface MockOwnerEntity {
  id: number;
  createdAt: Date;
  email: string;
}

interface MockFolderEntity {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  ownerId: string;
  name: string;

  owner: MockOwnerEntity;
}

describe("where-query.type", () => {
  describe("parseWhereQuery", () => {
    it("parses a full query", () => {
      const date = new Date(Date.now());

      const whereQuery: WhereQuery<MockFolderEntity> = {
        id: ["in", [1, 2, 3, 4, 5, 6]],
        createdAt: ["between", [subDays(date, 3), date]],
        deletedAt: ["lte", date],
        name: ["eq", "folder name 1"],
        ownerId: ["not", ["eq", "1"]],
      };

      const whereQueryJson = JSON.stringify(whereQuery);
      const parsed = parseWhereQuery(JSON.parse(whereQueryJson));

      expect(parsed).toEqual(whereQuery);
    });

    it("parses partial query", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        id: ["in", [1, 2, 3, 4, 5, 6]],
      };

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(parseWhereQuery(JSON.parse(whereQueryJson))).toEqual({
        id: ["in", [1, 2, 3, 4, 5, 6]],
      });
    });

    it("parses empty query", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {};

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(parseWhereQuery(JSON.parse(whereQueryJson))).toEqual({});
    });

    it("parses a query with an isNull operator", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = { ownerId: ["isNull"] };

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(parseWhereQuery(JSON.parse(whereQueryJson))).toEqual({
        ownerId: ["isNull"],
      });
    });

    it("throws an error for unknown operators", () => {
      const whereQuery = {
        id: ["unknown", [1, 2, 3, 4, 5, 6]],
        name: ["eq", "john"],
      };

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(() => parseWhereQuery(JSON.parse(whereQueryJson))).toThrow();
    });

    it("parses nested queries", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        owner: {
          email: ["eq", "email@example.com"],
        },
      };

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(parseWhereQuery(JSON.parse(whereQueryJson))).toEqual({
        owner: {
          email: ["eq", "email@example.com"],
        },
      });
    });

    it("converts date strings to date", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        createdAt: ["eq", "2022-08-26T12:46:17.634Z"],
        owner: {
          createdAt: ["eq", "2022-08-26T12:46:17.634Z"],
        },
      };

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(parseWhereQuery(JSON.parse(whereQueryJson))).toEqual({
        createdAt: ["eq", new Date("2022-08-26T12:46:17.634Z")],
        owner: {
          createdAt: ["eq", new Date("2022-08-26T12:46:17.634Z")],
        },
      });
    });

    it('does not convert the date string "33"', () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        createdAt: ["eq", "33"],
        owner: {
          createdAt: ["eq", "33"],
        },
      };

      const whereQueryJson = JSON.stringify(whereQuery);

      expect(parseWhereQuery(JSON.parse(whereQueryJson))).toEqual({
        createdAt: ["eq", "33"],
        owner: {
          createdAt: ["eq", "33"],
        },
      });
    });
  });

  describe("safeParseWhereQuery", () => {
    it("parses a full query", () => {
      const date = new Date(Date.now());

      const whereQuery: WhereQuery<MockFolderEntity> = {
        id: ["in", [1, 2, 3, 4, 5, 6]],
        createdAt: ["between", [subDays(date, 3), date]],
        deletedAt: ["lte", date],
        name: ["eq", "folder name 1"],
        ownerId: ["not", ["eq", "1"]],
      };

      const whereQueryJson = JSON.stringify(whereQuery);
      const parsed = safeParseWhereQuery(JSON.parse(whereQueryJson));
      const expected = wrapExpectedInSafeParseResponse(whereQuery);

      expect(parsed).toEqual(expected);
    });

    it("parses partial query", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        id: ["in", [1, 2, 3, 4, 5, 6]],
      };

      const whereQueryJson = JSON.stringify(whereQuery);
      const expected = wrapExpectedInSafeParseResponse(whereQuery);

      expect(safeParseWhereQuery(JSON.parse(whereQueryJson))).toEqual(expected);
    });

    it("parses empty query", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {};

      const whereQueryJson = JSON.stringify(whereQuery);
      const expected = wrapExpectedInSafeParseResponse(whereQuery);

      expect(safeParseWhereQuery(JSON.parse(whereQueryJson))).toEqual(expected);
    });

    it("parses a query with an isNull operator", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = { ownerId: ["isNull"] };

      const whereQueryJson = JSON.stringify(whereQuery);
      const expected = wrapExpectedInSafeParseResponse(whereQuery);

      expect(safeParseWhereQuery(JSON.parse(whereQueryJson))).toEqual(expected);
    });

    it("returns false on response object for unknown operators", () => {
      const whereQuery = {
        id: ["unknown", [1, 2, 3, 4, 5, 6]],
        name: ["eq", "john"],
      };

      const whereQueryJson = JSON.stringify(whereQuery);

      const found = safeParseWhereQuery(JSON.parse(whereQueryJson));
      expect(found.success).toEqual(false);
    });

    it("parses nested queries", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        owner: {
          email: ["eq", "email@example.com"],
        },
      };

      const whereQueryJson = JSON.stringify(whereQuery);
      const expected = wrapExpectedInSafeParseResponse(whereQuery);

      expect(safeParseWhereQuery(JSON.parse(whereQueryJson))).toEqual(expected);
    });

    it("converts date strings to date", () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        createdAt: ["eq", "2022-08-26T12:46:17.634Z"],
        owner: {
          createdAt: ["eq", "2022-08-26T12:46:17.634Z"],
        },
      };

      const whereQueryJson = JSON.stringify(whereQuery);
      const expected = wrapExpectedInSafeParseResponse({
        createdAt: ["eq", new Date("2022-08-26T12:46:17.634Z")],
        owner: {
          createdAt: ["eq", new Date("2022-08-26T12:46:17.634Z")],
        },
      });

      expect(safeParseWhereQuery(JSON.parse(whereQueryJson))).toEqual(expected);
    });

    it('does not convert the date string "33"', () => {
      const whereQuery: WhereQuery<MockFolderEntity> = {
        createdAt: ["eq", "33"],
        owner: {
          createdAt: ["eq", "33"],
        },
      };

      const whereQueryJson = JSON.stringify(whereQuery);
      const expected = wrapExpectedInSafeParseResponse(whereQuery);

      expect(safeParseWhereQuery(JSON.parse(whereQueryJson))).toEqual(expected);
    });
  });
});

function wrapExpectedInSafeParseResponse(expected: unknown) {
  return {
    data: expected,
    success: true,
  };
}
