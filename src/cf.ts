import {httpClient} from './http-client'
import {webComponents} from './web-components';

const cf = (function () {

  return {
    httpClient: httpClient,
    webComponents: webComponents,
  }

})();

export {cf}
