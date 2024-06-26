
// // this file is auto generated on 2020-03-19T21:03:37.050Z, don't modify it
// import { ReducerGroup, FetchVariants, Fetch } from "@typesafe-store/store"
// type Book = {
//     name: string;
//     year: number;
// };
// type Todo = {
//     id: string;
//     completed?: boolean;
//     text: string;
// };
// type GetBooks = Fetch<{
//     path: "books";
// }, string[], unknown>;

// export type SampleState = { name: string, count: number, person: { name: string; age: number; }, books: Book[], optionalTodos: (Todo | undefined)[], config: { count?: number | undefined; status?: string | undefined; obj1?: { one: number; obj1c?: { value: string; } | undefined; } | undefined; obj2?: { two: number; obj2a?: { name: string; obj2ao?: { value: string; } | undefined; }[] | undefined; } | undefined; arr1?: string[] | undefined; arr2?: { name: string; }[][] | undefined; arr3?: (({ name: string; } | undefined)[] | undefined)[] | undefined; }, getBooks: Readonly<{ loading?: boolean | undefined; error?: Error | undefined; data?: string[] | undefined; _fmeta?: { type: FetchVariants.GET; url: { path: "books"; }; body: {}; } | undefined; }>, getTwoBooks: Readonly<{ loading?: boolean | undefined; error?: Error | undefined; data?: Book[] | undefined; _fmeta?: { type: FetchVariants.GET; url: { path: ""; queryParams: { limit: 2; }; }; body: {}; } | undefined; }> }

// export type SampleAction = { name: "changeName", group: "Sample", payload: string } | { name: "increment", group: "Sample" } | { name: "changePersonName", group: "Sample", payload: string } | { name: "changePersonAge", group: "Sample", payload: number } | { name: "addBooks", group: "Sample", payload: Book[] } | { name: "removeLastBook", group: "Sample" } | { name: "removeFirstBook", group: "Sample" } | { name: "replaceBooks", group: "Sample", payload: Book[] } | { name: "fillBookAt0", group: "Sample", payload: Book } | { name: "modifyBookAt0", group: "Sample" } | { name: "modifyBookAtIndex", group: "Sample", payload: number } | { name: "chnageNameAndCount", group: "Sample", payload: { name: string, count: number } } | { name: "changeConfigCount", group: "Sample", payload: number } | { name: "modifyConfigObj1", group: "Sample" } | { name: "setConfigObj1", group: "Sample", payload: { one: number; obj1c?: { value: string; } | undefined; } | undefined } | { name: "setConfigObj1C", group: "Sample", payload: string } | { name: "setConfigObj2", group: "Sample", payload: { two: number; obj2a?: { name: string; obj2ao?: { value: string; } | undefined; }[] | undefined; } | undefined } | { name: "setConfigObj2a", group: "Sample", payload: string } | { name: "setConfigArr2", group: "Sample", payload: { name: string; }[][] | undefined } | { name: "addTodo", group: "Sample", payload: Todo } | { name: "completeFirstTodo", group: "Sample" } | { name: "completeTodoAtIndex", group: "Sample", payload: number }

// export type SampleAsyncAction = { name: "getBooks", group: "Sample", fetch: { type: FetchVariants.GET; url: { path: "books"; }; body: {}; } } | { name: "getTwoBooks", group: "Sample", fetch: { type: FetchVariants.GET; url: { path: ""; queryParams: { limit: 2; }; }; body: {}; } }

// export const SampleReducerGroup: ReducerGroup<SampleState, SampleAction, "Sample", SampleAsyncAction> = {
//     r:
//         (state: SampleState, action: SampleAction) => {
//             const t = action.name
//             switch (t) {
//                 case "changeName": {
//                     const name = (action as any).payload
//                     return { ...state, name: name }
//                 }
//                 case "increment": {
//                     let _tr_count = state.count
//                     _tr_count += 1
//                     _tr_count += 1
//                     return { ...state, count: _tr_count }
//                 }
//                 case "changePersonName": {
//                     const name = (action as any).payload
//                     return { ...state, person: { ...state.person, name: name } }
//                 }
//                 case "changePersonAge": {
//                     const age = (action as any).payload
//                     return { ...state, person: { ...state.person, age: age } }
//                 }
//                 case "addBooks": {
//                     const books = (action as any).payload
//                     return { ...state, books: state.books.concat(...books) }
//                 }
//                 case "removeLastBook": {

//                     return { ...state, books: state.books.slice(0, -1) }
//                 }
//                 case "removeFirstBook": {

//                     return { ...state, books: [...state.books.slice(0, 0), ...state.books.slice(1)] }
//                 }
//                 case "replaceBooks": {
//                     const books = (action as any).payload
//                     return { ...state, books: books }
//                 }
//                 case "fillBookAt0": {
//                     const book = (action as any).payload
//                     return { ...state, books: [...state.books].fill(book, 0) }
//                 }
//                 case "modifyBookAt0": {

//                     return { ...state, books: [...state.books.map((_tstore_v, _i) => _i === 1 ? { ..._tstore_v, name: "modifiedName" } : _tstore_v)] }
//                 }
//                 case "modifyBookAtIndex": {
//                     const index = (action as any).payload
//                     return { ...state, books: [...state.books.map((_tstore_v, _i) => _i === index ? { ..._tstore_v, name: `modified${index}Name` } : _tstore_v)] }
//                 }
//                 case "chnageNameAndCount": {
//                     const { name, count } = (action as any).payload
//                     return { ...state, person: { ...state.person, name: name }, count: count }
//                 }
//                 case "changeConfigCount": {
//                     const count = (action as any).payload
//                     return { ...state, config: { ...state.config, count: count } }
//                 }
//                 case "modifyConfigObj1": {

//                     return { ...state, config: { ...state.config, obj1: state.config.obj1 ? { ...state.config.obj1, one: state.config.obj1!.one + 1 } : state.config.obj1 } }
//                 }
//                 case "setConfigObj1": {
//                     const ob1 = (action as any).payload
//                     return { ...state, config: { ...state.config, obj1: ob1 } }
//                 }
//                 case "setConfigObj1C": {
//                     const v = (action as any).payload
//                     return { ...state, config: { ...state.config, obj1: state.config.obj1 ? state.config.obj1 ? { ...state.config.obj1, obj1c: state.config.obj1!.obj1c ? { ...state.config.obj1!.obj1c, value: v } : state.config.obj1!.obj1c } : state.config.obj1 : state.config.obj1 } }
//                 }
//                 case "setConfigObj2": {
//                     const ob2 = (action as any).payload
//                     return { ...state, config: { ...state.config, obj2: ob2 } }
//                 }
//                 case "setConfigObj2a": {
//                     const v = (action as any).payload
//                     return { ...state, config: { ...state.config, obj2: state.config.obj2 ? state.config.obj2 ? { ...state.config.obj2, obj2a: state.config.obj2!.obj2a ? [...state.config.obj2!.obj2a.map((_tstore_v, _i) => _i === 0 ? _tstore_v ? { ..._tstore_v, obj2ao: state.config.obj2!.obj2a![0].obj2ao ? { ...state.config.obj2!.obj2a![0].obj2ao, value: v } : state.config.obj2!.obj2a![0].obj2ao } : _tstore_v : _tstore_v)] : state.config.obj2!.obj2a } : state.config.obj2 : state.config.obj2 } }
//                 }
//                 case "setConfigArr2": {
//                     const a = (action as any).payload
//                     return { ...state, config: { ...state.config, arr2: a } }
//                 }
//                 case "addTodo": {
//                     const todo = (action as any).payload
//                     return { ...state, optionalTodos: state.optionalTodos.concat(todo) }
//                 }
//                 case "completeFirstTodo": {

//                     return { ...state, optionalTodos: [...state.optionalTodos.map((_tstore_v, _i) => _i === 0 ? _tstore_v ? { ..._tstore_v, completed: true } : _tstore_v : _tstore_v)] }
//                 }
//                 case "completeTodoAtIndex": {
//                     const index = (action as any).payload
//                     return { ...state, optionalTodos: [...state.optionalTodos.map((_tstore_v, _i) => _i === index ? _tstore_v ? { ..._tstore_v, completed: true } : _tstore_v : _tstore_v)] }
//                 }


//             }
//         }
//     , g: "Sample", ds: { name: "First", count: 1, person: { name: "P12", age: 10 }, books: [], optionalTodos: [], config: {}, getBooks: {}, getTwoBooks: {} }, m: { async: undefined, a: {} },
// }



