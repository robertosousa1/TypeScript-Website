## 1.1.1

- Better handling of JSON files

## 1.1.0

- Adds a JS file into the npm tarball for using with a vanilla script tag, which sets `global.twoslash` with the main twoslash function. You need to include a copy of tsvfs beforehand.

Unpkg URLS:

- https://unpkg.com/browse/@typescript/vfs@dist/vfs.globals.js
- https://unpkg.com/browse/@typescript/twoslash@dist/twoslash.globals.js

## 1.0.2

- The `// @x`, `// ^?` and `// ^^^` comments ignore preceding whitespace

## 1.0.1

- Adds an option for declaring the project's root to overlay the vfs over: `vfsRoot`

## 1.0.0

- Supports falling back to _your project's_ node modules for resolving types and imports. This drastically simplifies setting up a code sample which relies on types not shipped with TypeScript.
- Support for adding vfs JSON files in a code sample

## 0.5.0

- Support TS 4.0
- Improvements to @showEmit and @showEmittedFile
- when `noStaticSemanticInfo` is enabled then you an still run queries
- better multi-file support
- `emit` handbook option actually emits all the JS/DTS files back to the vfs
- `noErrorValidation` is better supported

## 0.4.0

- Lines with `// prettier-ignore` are stripped, if you want to show it in a code sample, use `/** prettier-ignore */`
- You can request completions at a particular point in a file, note: the results come directly from TS and a
  useful but will definitely require some work to massage into being useful (they're un-ordered and un-prioritised.)
  To make your life easier it also includes a "completionsPrefix" which is the substring between the position indicated and the nearest dot or space, you can use that to filter the results.

You can see some results in the main README now.

```ts
const myString = ""
myString.s
//       ^?
```

## 0.3.0

Lots of work on the query engine, now it works across many files and multiple times in the same file. For example:

```ts
const a = "123"
//    ^?
const b = "345"
//    ^?
```

and

```ts
// @filename: index.ts
const a = "123"
//    ^?
// @filename: main-file-queries.ts
const b = "345"
//    ^?
```

Now returns correct query responses, I needed this for the bug workbench.
http://www.staging-typescript.org/dev/bug-workbench

Also has a way to set the defaults for the config

## 0.2.0

Initial public version of Twoslash. Good enough for using on the
TypeScript website, but still with a chunk of holes.
