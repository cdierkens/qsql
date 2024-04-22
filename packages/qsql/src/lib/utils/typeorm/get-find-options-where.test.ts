import { subDays } from "date-fns";
import {
  Between,
  Equal,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  Not,
} from "typeorm";
import { WhereQuery } from "../../types/where-query.type";
import { getFindOptionsWhere } from "./get-find-options-where";
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

describe("getFindOptionsWhere", () => {
  it("transforms", () => {
    const now = new Date();

    const whereQuery: WhereQuery<MockFolderEntity> = {
      id: ["in", [1, 2, 3, 4, 5, 6]],
      createdAt: ["between", [subDays(now, 3), now]],
      deletedAt: ["lte", now],
      name: ["eq", "folder name 1"],
      ownerId: ["not", ["eq", "1"]],
    };

    const expected: FindOptionsWhere<MockFolderEntity> = {
      id: In([1, 2, 3, 4, 5, 6]),
      createdAt: Between(subDays(now, 3), now),
      deletedAt: LessThanOrEqual(now),
      name: Equal("folder name 1"),
      ownerId: Not(Equal("1")),
    };

    expect(getFindOptionsWhere(whereQuery)).toEqual(expected);
  });

  it("transforms isNull", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      ownerId: ["isNull"],
    };

    const expected: FindOptionsWhere<MockFolderEntity> = {
      ownerId: IsNull(),
    };

    expect(getFindOptionsWhere(whereQuery)).toEqual(expected);
  });

  it("handles nested queries", () => {
    const whereQuery: WhereQuery<MockFolderEntity> = {
      owner: {
        email: ["eq", "email@example.com"],
      },
    };

    const expected: FindOptionsWhere<MockFolderEntity> = {
      owner: {
        email: Equal("email@example.com"),
      },
    };

    expect(getFindOptionsWhere(whereQuery)).toEqual(expected);
  });
});
