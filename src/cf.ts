import {httpClient} from './http-client'
import {webComponents} from './web-components';

const cf = (function () {

  return {
    httpClient: httpClient,
    ui: {
      webComponents: webComponents,
    },
  }

})();

export {cf}
