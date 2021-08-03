import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cf.js',
      format: 'cjs'
    },
    {
      file: 'dist/cf.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()]
    }
  ]
};
