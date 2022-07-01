import {nodeResolve} from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default [{
  input: 'src/main.js', output: {
    file: 'dist/main.min.js',
    format: 'umd',
    name: 'cf',
    esModule: false,
    exports: 'named',
    sourcemap: true,
  }, plugins: [nodeResolve(), babel({
    babelHelpers: "bundled",
  }), compiler()]
}, {
  input: 'src/main.js', output: [{
    dir: "dist/esm", format: "esm", exports: "named", sourcemap: true,
  }, {
    dir: "dist/cjs", format: "cjs", exports: "named", sourcemap: true,
  }]
}]