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

To update the documentation you must write comments that TypeDoc understand.
See: https://typedoc.org/guides/doccomments/.

## run tests

We can run the tests with:
```shell
$ npm run test
```
or for continuous watching:
```shell
$ npm run test:watch
```

## run tests coverage

We can run the tests' coverage with:
```shell
$ npm run test:coverage
```

Results are displayed on the console:
```shell
=============================== Coverage summary ===============================
Statements   : 90.54% ( 67/74 )
Branches     : 78.79% ( 26/33 )
Functions    : 84.21% ( 16/19 )
Lines        : 90.14% ( 64/71 )
================================================================================
```

Detailed results are visible on: http://sdk-javascript.test/coverage/.

## lint

We use ESLint to lint our source files.

To show errors and warning:
```shell
$ npm run lint
```

To fix fixable ones:
```shell
$ npm run lint -- --fix
```

If you use IDEA, files found in `.idea/` should configure your IDE to check `.ts`
files directly on IDE based on [`.eslintrc.json`](.eslintrc.json) configuration.


## Publish the package

1. Be sure to build all before publishing

```shell
$ npm run build
```

2. Be sure the tests are ok before publishing

```shell
$ npm run test
```

3. Login to npmjs.org

```shell
$ npm login
Username: pbrisacier
Password:
Email: (this IS public) pbrisacier@mncc.fr
Logged in as pbrisacier on https://registry.npmjs.com/.
```

You can know if you're already connected with:
```shell
$ npm whoami
pbrisacier
```


4. Change version before publishing. 

Use semantic versioning to change version number. Use
[`npm version` command](https://docs.npmjs.com/cli/v6/commands/npm-version).

```shell
$ npm version patch
$ npm version minor
$ npm version major
```

Those commands will increment the version number and make a new git commit.

5. Dry run the publication

If you're not sure, make a try before publishing:
```shell
$ npm publish --access public --dry-run
npm notice
npm notice package: @computablefacts/sdk-javascript@1.0.0
npm notice === Tarball Contents ===
npm notice 2.5kB dist/api-client.js
npm notice 3.0kB dist/api.js
npm notice 120B  dist/cf.js
npm notice 6.0kB dist/bundle/index.js
npm notice 522B  dist/index.js
npm notice 2.0kB dist/bundle/index.min.js
npm notice 1.7kB package.json
npm notice 463B  README.md
npm notice 128B  dist/api-client.d.ts
npm notice 531B  dist/api.d.ts
npm notice 90B   dist/cf.d.ts
npm notice 12B   dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          @computablefacts/sdk-javascript
npm notice version:       1.0.0
npm notice package size:  4.2 kB
npm notice unpacked size: 17.1 kB
npm notice shasum:        9888c35d2b3d3aaba2985e20b1167c464409e95d
npm notice integrity:     sha512-dOy+tpeLj7r8Y[...]deS116bSkgfCA==
npm notice total files:   12
npm notice
+ @computablefacts/sdk-javascript@1.0.0
```

6. Publish

```shell
$ npm publish --access public
npm notice
npm notice package: @computablefacts/sdk-javascript@1.0.0
npm notice === Tarball Contents ===
npm notice 2.5kB dist/api-client.js
npm notice 3.0kB dist/api.js
npm notice 120B  dist/cf.js
npm notice 6.0kB dist/bundle/index.js
npm notice 522B  dist/index.js
npm notice 2.0kB dist/bundle/index.min.js
npm notice 1.7kB package.json
npm notice 463B  README.md
npm notice 128B  dist/api-client.d.ts
npm notice 531B  dist/api.d.ts
npm notice 90B   dist/cf.d.ts
npm notice 12B   dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          @computablefacts/sdk-javascript
npm notice version:       1.0.0
npm notice package size:  4.2 kB
npm notice unpacked size: 17.1 kB
npm notice shasum:        9888c35d2b3d3aaba2985e20b1167c464409e95d
npm notice integrity:     sha512-dOy+tpeLj7r8Y[...]deS116bSkgfCA==
npm notice total files:   12
npm notice
+ @computablefacts/sdk-javascript@1.0.0
```
