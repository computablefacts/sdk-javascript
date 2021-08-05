import {terser} from 'rollup-plugin-terser';

export default {
  input: 'dist/index.js',
  context: 'window',
  output: [
    {
      file: 'dist/bundle/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/bundle/index.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()]
    }
  ]
};
