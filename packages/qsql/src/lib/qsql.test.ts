import { fromQueryString, toQueryString } from "./qsql";
import { describe, it, expect } from "vitest";

describe("qsql", () => {
  describe("toQueryString", () => {
    it("should create a query string with where", () => {
      expect(
        toQueryString({
          where: {
            id: ["in", [1, 2, 3]],
          },
        })
      ).toEqual(`where=${encodeURIComponent('{"id":["in",[1,2,3]]}')}`);
    });

    it("should create a query string with order", () => {
      expect(
        toQueryString({
          order: {
            id: "asc",
          },
        })
      ).toEqual(`order=${encodeURIComponent('{"id":"asc"}')}`);
    });

    it("should create a query string with page", () => {
      expect(
        toQueryString({
          page: 1,
        })
      ).toEqual("page=1");
    });

    it("should create a query string with perPage", () => {
      expect(
        toQueryString({
          perPage: 20,
        })
      ).toEqual("perPage=20");
    });

    it("should create a query with all options", () => {
      expect(
        toQueryString({
          where: {
            id: ["in", [1, 2, 3]],
          },
          order: {
            id: "asc",
          },
          page: 1,
          perPage: 20,
        })
      ).toEqual(
        `where=${encodeURIComponent(
          '{"id":["in",[1,2,3]]}'
        )}&order=${encodeURIComponent('{"id":"asc"}')}&page=1&perPage=20`
      );
    });
  });

  describe("fromQueryString", () => {
    it("should return an empty object for an empty string", () => {
      expect(fromQueryString("")).toEqual({});
    });

    it("should return an empty object for a query string with unknown keys", () => {
      expect(fromQueryString("unknown=value")).toEqual({});
    });

    describe("where", () => {
      it("should return a where query for a query string with a valid where key", () => {
        expect(
          fromQueryString(
            "filter=id(in(1,2,3)),name(between('abe','zeta')),archived(not(eq(true)))"
          )
        ).toEqual({
          where: {
            id: ["in", [1, 2, 3]],
            name: ["between", ["abe", "zeta"]],
            archived: ["not", ["eq", true]],
          },
        });
      });

      it("should throw for unknown operators", () => {
        expect(() => fromQueryString("filter=id(unknown(1,2,3))")).toThrow();
      });

      it("should throw for invalid single value operators", () => {
        expect(() => fromQueryString("filter=id(eq(1,2,3))")).toThrow();
      });

      it("should throw for invalid between value operators", () => {
        expect(() => fromQueryString("filter=id(between(1, 2, 3))")).toThrow();
      });
    });

    describe("order", () => {
      it("should return an order query for a query string with a valid order key", () => {
        expect(fromQueryString('order={"id":"asc"}')).toEqual({
          order: { id: "asc" },
        });
      });
    });

    describe("page", () => {
      it("should return an page query for a query string with a valid page", () => {
        expect(fromQueryString("page=1")).toEqual({ page: 1 });
      });
    });

    describe("perPage", () => {
      it("should return an perPage query for a query string with a valid perPage", () => {
        expect(fromQueryString("perPage=20")).toEqual({ perPage: 20 });
      });
    });
  });
});
