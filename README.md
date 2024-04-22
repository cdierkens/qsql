# QueryString Query Language

This repo holds an exploratory language not meant to be used in production. It was
a learning exercise meant to practice defining a parsable query syntax that can be
used in a query string of a url.

## Goals

1. Be human readable in a URL (e.g. "http://www.example.com?query=prop1(lte(10)),prop2(lte(10))" )
1. Convert to a intermediate JavaScript data structure that can be adapted to another query api, such as MongoDB, or TypeOrm.

## Structure

### Expressions

`Expressions` a grouping of one or more operations on a property of a resource.

```
<Property>(<Operator>(<Value>))[,Expressions]
```

### Properties

`Properties` are properties used to perform an operation. For example, given the `/folders` resource below, the available `Properties` are `id`, `createdAt`, `ownerId`, and `name`.

```json
{
  "folders": [
    {
      "id": 0,
      "createdAt": "string",
      "ownerId": "string",
      "name": "string"
    }
  ],
  "pageData": { ... }
}
```

`Expressions` containing one or more unknown `Properties` result in a `400 Bad Request`.

### Operators

`Operators` determine the operation to apply when ing results.

| Operator | Description              | Example                          |
| :------- | :----------------------- | :------------------------------- |
| ,        | and                      | `prop1(lte(10)), prop2(lte(10))` |
| between  | between values           | `prop(between(1,10))`            |
| eq       | equal to                 | `prop(eq(10))`                   |
| gt       | greater than             | `prop(gt(10))`                   |
| gte      | greater than or equal to | `prop(gte(10))`                  |
| in       | in array                 | `prop(in('a', 'b', 'c'))`        |
| isNull   | is null                  | `prop(isNull())`                 |
| lt       | less than                | `prop(lt(100))`                  |
| lte      | less than or equal to    | `prop(lte(100))`                 |
| not      | not                      | `prop(not(lte(100)))`            |

### Values

`Values` are values used to perform a operation. A `Value` can be of type `string`, `number`, `boolean`, `ISODateString` or a single dimension `array` of these types.

| Type          | Example                                                                          |
| :------------ | :------------------------------------------------------------------------------- |
| string        | `'string'`                                                                       |
| number        | `10`, `-10`, `0.10`                                                              |
| boolean       | `true`, `false`                                                                  |
| ISODateString | `'2022-07-31T00:00:00.000Z'`                                                     |
| array         | `'foo','bar'`, `1,2,3`, `'2022-07-31T00:00:00.000Z', '2022-08-31T00:00:00.000Z'` |
