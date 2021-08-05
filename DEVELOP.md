# develop

## organisation

This library is written with [TypeScript](https://www.typescriptlang.org/). 
`tsc` is use to build the ES6 javascript files of the package.

Then [rollup.js](https://rollupjs.org/) is used to bundle all the files in one .js to allow browser to use 
the library.

Automated tests are also written with TypeScript using [Mocha](https://mochajs.org/) 
and [Chai](https://www.chaijs.com/).

Finally, a documentation is produced from the source code with [TypeDoc](https://typedoc.org/).

Then, we publish the package to [npmjs.org](https://www.npmjs.com/package/@computablefacts/sdk-javascript).

## installation

`git clone` this repo and install dependencies with:

```shell
$ npm install
```

## start developing

```shell
$ npm run start
```
or
```shell
$ npm run dev
```

It'll launch, in the same console, 4 commands that continuously watch for changes in code:

- TSC: compile TypeScript. May displayed Type errors.
- MOCHA: launch tests. May displayed test errors.
- BUNDLE: generate the browser bundle.
- DOC: generate the documentation.

Each of those commands could be launched separately.

## use it locally

To use the package locally and verify that it works correctly, you can use 
[`npm link` command](https://docs.npmjs.com/cli/v6/commands/npm-link).

Or, with a static HTML page, use a webserver (apache, nginx) with or
without a tool like [Laragon](https://laragon.org/) to publish the package
over HTTP and use it from the HTML:

```html
<script src="http://sdk-javascript.test/dist/bundle/index.js"></script>
```

## build TypeScript

We can build the ES6 npm package with:
```shell
$ npm run build:ts
```
or for continuous watching:
```shell
$ npm run build:ts:watch
```

## build bundle

We can build the bundle for browser with:
```shell
$ npm run build:bundle
```
or for continuous watching:
```shell
$ npm run build:bundle:watch
```

## build the documentation

We can build the documentation with:
```shell
$ npm run build:doc
```
or for continuous watching:
```shell
$ npm run build:doc:watch
```

## run tests

We can run the tests with:
```shell
$ npm run test
```
or for continuous watching:
```shell
$ npm run test:watch
```

## Publish the package

1. Login to npmjs.org

```shell
$ npm login
Username: pbrisacier
Password:
Email: (this IS public) pbrisacier@mncc.fr
Logged in as pbrisacier on https://registry.npmjs.com/.

$ npm publish --access public
npm notice
npm notice package: @computablefacts/sdk-javascript@0.1.0
npm notice === Tarball Contents ===
npm notice 30B  dist/index.ts
npm notice 858B package.json
npm notice === Tarball Details ===
npm notice name:          @computablefacts/sdk-javascript
npm notice version:       0.1.0
npm notice package size:  568 B
npm notice unpacked size: 888 B
npm notice shasum:        a4bd2010fd32ff397825beeaa2e8cf4b3e6a1bb8
npm notice integrity:     sha512-W9tkDC8Dowlhl[...]JZA2MySLviHJg==
npm notice total files:   2
npm notice
+ @computablefacts/sdk-javascript@0.1.0
```

2. Change version before publishing. 

Use semantic versioning to change version number. Use
[`npm version` command](https://docs.npmjs.com/cli/v6/commands/npm-version).

```shell
$ npm version patch
$ npm version minor
$ npm version major
```

Those commands will increment the version number and make a new git commit.

3. Dry run the publication

If you're not sure, make a try before publishing:
```shell
$ npm publish --access public --dry-run
npm notice
npm notice package: @computablefacts/sdk-javascript@0.2.0
npm notice === Tarball Contents ===
npm notice 2.5kB dist/api-client.js
npm notice 3.0kB dist/api.js
npm notice 120B  dist/cf.js
npm notice 6.0kB dist/bundle/index.js
npm notice 522B  dist/index.js
npm notice 2.0kB dist/bundle/index.min.js
npm notice 1.6kB package.json
npm notice 463B  README.md
npm notice 128B  dist/api-client.d.ts
npm notice 531B  dist/api.d.ts
npm notice 90B   dist/cf.d.ts
npm notice 12B   dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          @computablefacts/sdk-javascript
npm notice version:       0.2.0
npm notice package size:  4.2 kB
npm notice unpacked size: 17.0 kB
npm notice shasum:        bc88ec4e287c2c111407303820bc95cfc7021afa
npm notice integrity:     sha512-dFqKBBke/H7ak[...]+4aXe8fkL9pnQ==
npm notice total files:   12
npm notice
+ @computablefacts/sdk-javascript@0.2.0
```

4. Publish

```shell
$ npm publish --access public
npm notice
npm notice package: @computablefacts/sdk-javascript@0.2.0
npm notice === Tarball Contents ===
npm notice 2.5kB dist/api-client.js
npm notice 3.0kB dist/api.js
npm notice 120B  dist/cf.js
npm notice 6.0kB dist/bundle/index.js
npm notice 522B  dist/index.js
npm notice 2.0kB dist/bundle/index.min.js
npm notice 1.6kB package.json
npm notice 463B  README.md
npm notice 128B  dist/api-client.d.ts
npm notice 531B  dist/api.d.ts
npm notice 90B   dist/cf.d.ts
npm notice 12B   dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          @computablefacts/sdk-javascript
npm notice version:       0.2.0
npm notice package size:  4.2 kB
npm notice unpacked size: 17.0 kB
npm notice shasum:        bc88ec4e287c2c111407303820bc95cfc7021afa
npm notice integrity:     sha512-dFqKBBke/H7ak[...]+4aXe8fkL9pnQ==
npm notice total files:   12
npm notice
+ @computablefacts/sdk-javascript@0.2.0
```
