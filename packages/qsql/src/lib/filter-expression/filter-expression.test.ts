import { toWhereQuery } from "./filter-expression";
import { describe, it, expect } from "vitest";

describe("FilterExpression", () => {
  it("should convert `FilterExpression`s to a `WhereQuery`", () => {
    expect(
      toWhereQuery(
        "key1(eq('rice')),key2.child(in(1,2,3,4,5)),key3(not(in(true,false))),key4(isNull())"
      )
    ).toEqual({
      key1: ["eq", "rice"],
      key2: {
        child: ["in", [1, 2, 3, 4, 5]],
      },
      key3: ["not", ["in", [true, false]]],
      key4: ["isNull"],
    });
  });
});
