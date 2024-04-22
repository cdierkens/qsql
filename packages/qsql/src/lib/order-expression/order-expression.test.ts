import { toOrderQuery } from "./order-expression";
import { describe, it, expect } from "vitest";

describe("OrderExpression", () => {
  it("should convert `OrderExpression`s to a `OrderQuery`", () => {
    expect(toOrderQuery("key")).toEqual({ key: "asc" });

    expect(toOrderQuery("-key")).toEqual({ key: "desc" });

    expect(toOrderQuery("key,-key2,key3")).toEqual({
      key: "asc",
      key2: "desc",
      key3: "asc",
    });

    expect(toOrderQuery("-key,-key2,-key3")).toEqual({
      key: "desc",
      key2: "desc",
      key3: "desc",
    });

    expect(toOrderQuery("")).toEqual({});

    expect(toOrderQuery("-key,-key2,-key3,")).toEqual({
      key: "desc",
      key2: "desc",
      key3: "desc",
    });
  });
});
