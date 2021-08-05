type materializeSqlConfig = {
  query: string,
  format: string,
}

interface CfApiInterface {
  getToken: () => string,
  setToken: (newValue: string) => void,
  hasToken: () => boolean,

  getBaseUrl: () => string,
  setBaseUrl: (newValue: string) => void,
  hasBaseUrl: () => boolean,

  init: (token?: string, baseUrl?: string) => void,
  hasAutodetect: () => boolean,
  materializeSql: (config: materializeSqlConfig) => Promise<Response>,
}

export {CfApiInterface, materializeSqlConfig}
