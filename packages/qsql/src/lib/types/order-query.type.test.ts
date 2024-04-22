import { OrderQuery, parseOrderQuery } from "./order-query.type";
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

describe("order-query.type", () => {
  it("parses a full query", () => {
    const orderQuery: OrderQuery<MockFolderEntity> = {
      id: "asc",
      createdAt: "desc",
      deletedAt: "asc",
      name: "desc",
      ownerId: "asc",
    };

    const orderQueryJson = JSON.stringify(orderQuery);
    const parsed = parseOrderQuery(JSON.parse(orderQueryJson));

    expect(parsed).toEqual(orderQuery);
  });

  it("parses partial query", () => {
    const orderQuery: OrderQuery<MockFolderEntity> = {
      id: "asc",
    };

    const orderQueryJson = JSON.stringify(orderQuery);

    expect(parseOrderQuery(JSON.parse(orderQueryJson))).toEqual({
      id: "asc",
    });
  });

  it("parses empty query", () => {
    const orderQuery: OrderQuery<MockFolderEntity> = {};

    const orderQueryJson = JSON.stringify(orderQuery);

    expect(parseOrderQuery(JSON.parse(orderQueryJson))).toEqual({});
  });

  it("throws an error for unknown order directions", () => {
    const orderQuery = {
      id: "unknown",
    };

    const orderQueryJson = JSON.stringify(orderQuery);

    expect(() => parseOrderQuery(JSON.parse(orderQueryJson))).toThrow();
  });

  it("parses nested queries", () => {
    const orderQuery: OrderQuery<MockFolderEntity> = {
      owner: {
        email: "desc",
      },
    };

    const orderQueryJson = JSON.stringify(orderQuery);

    expect(parseOrderQuery(JSON.parse(orderQueryJson))).toEqual({
      owner: {
        email: "desc",
      },
    });
  });
});
