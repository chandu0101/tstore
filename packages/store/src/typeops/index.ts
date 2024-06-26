import { HttpGet, HttpPut } from "../http";

export type TypeOpEntity =
  | ({ id: string | number } | { _id: string | number })[]
  | undefined
  | null;

export type AppendToList<T extends TypeOpEntity> = {};

export type PrependToList<T extends TypeOpEntity> = {};

export type UpdateList<T extends TypeOpEntity> = {};

export type DeleteFromList<T extends TypeOpEntity> = {};

export type AppendToListAndDiscard<T extends TypeOpEntity> = {};

export type PrependToListAndDiscard<T extends TypeOpEntity> = {};

export type UpdateListAndDiscard<T extends TypeOpEntity> = {};

export type DeleteFromListAndDiscard<T extends TypeOpEntity> = {};

export type PaginateAppend<T extends TypeOpEntity = null> = {};

export type PaginatePrepend<T extends TypeOpEntity = null> = {};

export type TypeOpsType =
  | "AppendToList"
  | "PrependToList"
  | "UpdateList"
  | "DeleteFromList"
  | "AppendToListAndDiscard"
  | "PrependToListAndDiscard"
  | "UpdateListAndDiscard"
  | "DeleteFromListAndDiscard"
  | "PaginateAppend"
  | "PaginatePrepend";

type Book = { name: string; id: string };

namespace myApi {
  export type GetBooks = HttpGet<{ path: "" }, Book[], Error>;
  export type GetBooks2 = HttpGet<{ path: "" }, Book[], string>;
  export type UpdateBook = HttpPut<{ path: "" }, {}, Book, Error>;
}

class Sample {
  list: myApi.GetBooks = null as any;
  ib: myApi.UpdateBook = {};
  ib2: myApi.GetBooks2 = {};
}
