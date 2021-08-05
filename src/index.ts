import {cf} from './cf'

// Inspire by: https://unpkg.com/vue@2.6.14/dist/vue.js
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = {cf};
}

if (typeof window === 'object') {
  // @ts-ignore
  // error TS2339: Property 'cf' does not exist on type 'Window & typeof globalThis'.
  window.cf = cf;
}

//console.log('typeof exports=', typeof exports)
//console.log('exports=', exports)
//console.log('typeof module=', typeof module)
//console.log('module=', module)
