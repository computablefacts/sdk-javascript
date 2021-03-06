import {CfCustomWindow} from './custom.window'
import {cf} from './cf'

declare let window: CfCustomWindow;

// Inspire by: https://unpkg.com/vue@2.6.14/dist/vue.js
if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = {cf};
}

if (typeof window === 'object') {
    window.cf = cf;
}

//console.log('typeof exports=', typeof exports)
//console.log('exports=', exports)
//console.log('typeof module=', typeof module)
//console.log('module=', module)
