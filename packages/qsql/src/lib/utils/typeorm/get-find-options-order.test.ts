import { FindOptionsOrder } from "typeorm";
import { OrderQuery } from "../../types/order-query.type";
import { getFindOptionsOrder } from "./get-find-options-order";
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

describe("getFindOptionsOrder", () => {
  it("transforms", () => {
    const OrderQuery: OrderQuery<MockFolderEntity> = {
      id: "asc",
      createdAt: "desc",
      deletedAt: "asc",
      name: "desc",
      ownerId: "asc",
    };

    const expected: FindOptionsOrder<MockFolderEntity> = {
      id: "asc",
      createdAt: "desc",
      deletedAt: "asc",
      name: "desc",
      ownerId: "asc",
    };

    expect(getFindOptionsOrder(OrderQuery)).toEqual(expected);
  });

  it("handles nested queries", () => {
    const OrderQuery: OrderQuery<MockFolderEntity> = {
      owner: {
        email: "asc",
      },
    };

    const expected: FindOptionsOrder<MockFolderEntity> = {
      owner: {
        email: "asc",
      },
    };

    expect(getFindOptionsOrder(OrderQuery)).toEqual(expected);
  });
});
