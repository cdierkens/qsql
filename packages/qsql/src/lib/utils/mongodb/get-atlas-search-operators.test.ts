import { subDays } from "date-fns";
import { WhereQuery } from "../../types/where-query.type";
import {
  AtlasSearchFilter,
  getAtlasSearchOperators,
} from "./get-atlas-search-operators";
import { describe, it, expect } from "vitest";

interface MockChildEntity {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  name: string;
}

interface MockFolderEntity {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  ownerId: string;
  name: string;

  child: MockChildEntity;
  child2: MockChildEntity;
}

describe("getAtlasSearchOperators", () => {
  it("transforms", () => {
    const now = new Date();

    const whereQuery: WhereQuery<MockFolderEntity> = {
      id: ["in", [1, 2, 3, 4, 5, 6]],
      createdAt: ["between", [subDays(now, 3), now]],
      deletedAt: ["lte", now],
      name: ["eq", "folder name 1"],
      ownerId: ["not", ["eq", "1"]],
    };

    const expected: AtlasSearchFilter = {
      must: [
        { in: { path: "id", value: [1, 2, 3, 4, 5, 6] } },
        { range: { path: "createdAt", gte: subDays(now, 3), lte: now } },
        { range: { path: "deletedAt", lte: now } },
        { equals: { path: "name", value: "folder name 1" } },
      ],
      mustNot: [{ equals: { path: "ownerId", value: "1" } }],
    };

    expect(getAtlasSearchOperators(whereQuery)).toEqual(expected);
  });

  it("transforms isNull", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      ownerId: ["isNull"],
    };

    const expected: AtlasSearchFilter = {
      must: [],
      mustNot: [{ exists: { path: "ownerId" } }],
    };

    expect(getAtlasSearchOperators(whereQuery)).toEqual(expected);
  });

  it("transforms nested queries", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      child: { id: ["in", [1, 2, 3, 4, 5, 6]] },
    };

    const expected: AtlasSearchFilter = {
      must: [{ in: { path: "child.id", value: [1, 2, 3, 4, 5, 6] } }],
      mustNot: [],
    };

    expect(getAtlasSearchOperators(whereQuery)).toEqual(expected);
  });

  it("transforms complex nested queries", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      child: { id: ["in", [1, 2, 3, 4, 5, 6]], name: ["eq", "Steve"] },
      child2: { id: ["between", [1, 6]], name: ["not", ["lt", "Steve"]] },
    };

    const expected: AtlasSearchFilter = {
      must: [
        { in: { path: "child.id", value: [1, 2, 3, 4, 5, 6] } },
        { equals: { path: "child.name", value: "Steve" } },
        { range: { path: "child2.id", gte: 1, lte: 6 } },
      ],
      mustNot: [{ range: { path: "child2.name", lt: "Steve" } }],
    };

    expect(getAtlasSearchOperators(whereQuery)).toEqual(expected);
  });

  it("transform in queries with string values", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      name: ["in", ["one", "two"]],
    };

    const expected: AtlasSearchFilter = {
      must: [{ text: { path: "name", query: ["one", "two"] } }],
      mustNot: [],
    };

    expect(getAtlasSearchOperators(whereQuery)).toEqual(expected);
  });
});
