import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import jsdoc from 'rollup-plugin-jsdoc';
import exclude from "rollup-plugin-exclude-dependencies-from-bundle";

export default [{
  input: 'src/main.js', output: {
    file: 'dist/main.min.js',
    format: 'umd',
    name: 'com.computablefacts',
    esModule: false,
    exports: 'named',
    sourcemap: true,
  }, plugins: [exclude({
    peerDependencies: true, dependencies: false
  }), resolve(), commonjs(), babel({
    babelHelpers: 'bundled',
  }), jsdoc({
    config: 'jsdoc.config.json',
  }), terser()]
}, {
  input: 'src/main.js', output: {
    dir: 'dist/esm', format: 'esm', exports: 'named', sourcemap: true
  }
}, {
  input: 'src/main.js', output: {
    dir: 'dist/cjs', format: 'cjs', exports: 'named', sourcemap: true
  }
}]