import { Sort } from "mongodb";
import { OrderQuery } from "../../types/order-query.type";
import { getSort } from "./get-sort";
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

describe("getSort", () => {
  it("transforms", () => {
    const OrderQuery: OrderQuery<MockFolderEntity> = {
      id: "asc",
      createdAt: "desc",
      deletedAt: "asc",
      name: "desc",
      ownerId: "asc",
    };

    const expected: Sort = {
      id: 1,
      createdAt: -1,
      deletedAt: 1,
      name: -1,
      ownerId: 1,
    };

    expect(getSort(OrderQuery)).toEqual(expected);
  });

  it("handles nested queries", () => {
    const OrderQuery: OrderQuery<MockFolderEntity> = {
      owner: {
        email: "asc",
      },
    };

    const expected: Sort = {
      "owner.email": 1,
    };

    expect(getSort(OrderQuery)).toEqual(expected);
  });
});
