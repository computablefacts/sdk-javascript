# usage

## with npm

```shell
$ npm i @computablefacts/sdk-javascript
```

## inside a static HTML page

```html
<script src="https://unpkg.com/@computablefacts/sdk-javascript"></script>
```

# test, build and publish

```shell
$ npm run test
```

```shell
$ npm run build
```

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
npm notice 30B  dist/index.js
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

# develop

Code your JavaScript with ES6. Add a test file `xxx.test.js` for each source 
file.
Run tests continuously with:

```shell
$ npm run dev
```

## use it locally

To use the package locally and verify that it works correctly, 
you can use [`npm link` command](https://docs.npmjs.com/cli/v6/commands/npm-link).

Or, with a static HTML page, use a webserver (apache, nginx) with or with a 
tool like laragon to publish the package over HTTP and use it from the
HTML:

```html
<script src="http://sdk-javascript.test/dist/index.js"></script>
```

## change version before publishing

Use semantic versionning to change version number. Use 
[`npm version` command](https://docs.npmjs.com/cli/v6/commands/npm-version).

```shell
$ npm version patch
$ npm version minor
$ npm version major
```
