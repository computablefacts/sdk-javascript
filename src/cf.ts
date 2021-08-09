import {httpClient} from './http-client'

const cf = (function () {

  return {
    httpClient: httpClient
  }

})();

export {cf}
