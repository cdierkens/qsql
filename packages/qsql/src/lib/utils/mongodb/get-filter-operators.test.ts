import { subDays } from "date-fns";
import { WhereQuery } from "../../types/where-query.type";
import {
  Between,
  Equal,
  Filter,
  getFilterOperators,
  In,
  IsNull,
  LessThanOrEqual,
  Not,
} from "./get-filter-operators";
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

describe("getFilterOperators", () => {
  it("transforms", () => {
    const now = new Date();

    const whereQuery: WhereQuery<MockFolderEntity> = {
      id: ["in", [1, 2, 3, 4, 5, 6]],
      createdAt: ["between", [subDays(now, 3), now]],
      deletedAt: ["lte", now],
      name: ["eq", "folder name 1"],
      ownerId: ["not", ["eq", "1"]],
    };

    const expected: Filter<MockFolderEntity> = {
      id: In([1, 2, 3, 4, 5, 6]),
      createdAt: Between(subDays(now, 3), now),
      deletedAt: LessThanOrEqual(now),
      name: Equal("folder name 1"),
      ownerId: Not(Equal("1")),
    };

    expect(getFilterOperators(whereQuery)).toEqual(expected);
  });

  it("transforms isNull", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      ownerId: ["isNull"],
    };

    const expected: Filter<MockFolderEntity> = {
      ownerId: IsNull(),
    };

    expect(getFilterOperators(whereQuery)).toEqual(expected);
  });

  it("transforms nested queries", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      child: { id: ["in", [1, 2, 3, 4, 5, 6]] },
    };

    const expected: Filter<MockFolderEntity> = {
      "child.id": { $in: [1, 2, 3, 4, 5, 6] },
    };

    expect(getFilterOperators(whereQuery)).toEqual(expected);
  });

  it("transforms complex nested queries", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      child: { id: ["in", [1, 2, 3, 4, 5, 6]], name: ["eq", "Steve"] },
      child2: { id: ["between", [1, 6]], name: ["not", ["lt", "Steve"]] },
    };

    const expected: Filter<MockFolderEntity> = {
      "child.id": { $in: [1, 2, 3, 4, 5, 6] },
      "child.name": {
        $eq: "Steve",
      },
      "child2.id": {
        $gte: 1,
        $lte: 6,
      },
      "child2.name": {
        $not: {
          $lt: "Steve",
        },
      },
    };

    expect(getFilterOperators(whereQuery)).toEqual(expected);
  });
});
