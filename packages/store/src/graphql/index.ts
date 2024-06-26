import { HttpPost, HttpBody, HttpResponse } from "../http";
import { TSWebSocket } from "../websockets";

export type GraphqlQuery<U extends string, B extends HttpBody, R extends HttpResponse, E> = HttpPost<
  { path: U },
  B,
  R,
  E
>;

export type GraphqlMutation<
  U extends string,
  B extends HttpBody,
  R extends HttpResponse,
  E
> = HttpPost<{ path: U }, B, R, E>;

export type GraphqlSubscription<
  U extends string,
  B extends HttpBody,
  R,
  E
> = TSWebSocket<U, string, R, E>;

export interface SourceLocation {
  readonly line: number;
  readonly column: number;
}

/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */
export interface GraphQLError {
  /**
   * A message describing the Error for debugging purposes.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   *
   * Note: should be treated as readonly, despite invariant usage.
   */
  message: string;

  /**
   * An array of { line, column } locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  readonly locations: ReadonlyArray<SourceLocation> | undefined;

  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  readonly path: ReadonlyArray<string | number> | undefined;

  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  readonly nodes: ReadonlyArray<any> | undefined;

  /**
   * The source GraphQL document corresponding to this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  readonly source: any | undefined;

  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  readonly positions: ReadonlyArray<number> | undefined;

  /**
   * The original error thrown from a field resolver during execution.
   */
  readonly originalError: Error | null;

  /**
   * Extension fields to add to the formatted error.
   */
  readonly extensions: { [key: string]: any } | undefined;
}
