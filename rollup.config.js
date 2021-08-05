import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    {
      file: 'dist/bundle.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()]
    }
  ]
};
