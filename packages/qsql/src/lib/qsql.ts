import { z } from "zod";
import { evaluate } from "./ast/ast.evaluate";
import { tokenize } from "./filter-expression/filter-expression.lexer";
import { parse } from "./filter-expression/filter-expression.parser";
import { parseOrderQuery } from "./types/order-query.type";
import { Query } from "./types/query.type";

export function toQueryString<T>(query: Query<T>): string {
  const searchParameters = new URLSearchParams();

  if (query.where) {
    searchParameters.append("where", JSON.stringify(query.where));
  }

  if (query.order) {
    searchParameters.append("order", JSON.stringify(query.order));
  }

  if (query.page) {
    searchParameters.append("page", String(query.page));
  }

  if (query.perPage) {
    searchParameters.append("perPage", String(query.perPage));
  }

  return searchParameters.toString();
}

export function fromQueryString<T>(string: string): Query<T> {
  const searchParameters = new URLSearchParams(string);

  const query: Query<unknown> = {};

  const filterParameter = searchParameters.get("filter");
  if (filterParameter) {
    query.where = evaluate(parse(tokenize(filterParameter)));
  }

  const orderParameter = searchParameters.get("order");
  if (orderParameter) {
    query.order = parseOrderQuery(JSON.parse(orderParameter));
  }

  const pageParameter = searchParameters.get("page");
  if (pageParameter) {
    query.page = z.number().parse(JSON.parse(pageParameter));
  }

  const perPageParameter = searchParameters.get("perPage");
  if (perPageParameter) {
    query.perPage = z.number().parse(JSON.parse(perPageParameter));
  }

  return query;
}
