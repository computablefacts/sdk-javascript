import {nodeResolve} from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import jsdoc from 'rollup-plugin-jsdoc';

export default [{
  input: 'src/main.js', output: {
    file: 'dist/main.min.js',
    format: 'umd',
    name: 'com.computablefacts',
    esModule: false,
    exports: 'named',
    sourcemap: true,
  }, plugins: [nodeResolve(), babel({
    babelHelpers: "bundled",
  }), jsdoc({
    config: 'jsdoc.config.json',
  }), compiler({
    language_out: 'STABLE', warning_level: 'VERBOSE',
  })]
}, {
  input: 'src/main.js', output: [{
    dir: "dist/esm", format: "esm", exports: "named", sourcemap: true,
  }, {
    dir: "dist/cjs", format: "cjs", exports: "named", sourcemap: true,
  }]
}]