type materializeSqlConfig = {
  query: string,
  format: string,
}

interface CfApiInterface {
  /**
   * Return the current API token.
   */
  getToken: () => string,

  /**
   * Set the API token.
   *
   * @param newValue The cf-ui API token
   */
  setToken: (newValue: string) => void,

  /**
   * @returns `true` if the API token is set.
   */
  hasToken: () => boolean,

  /**
   * Return the current API base URL.
   */
  getBaseUrl: () => string,

  /**
   * Set the API base URL.
   *
   * @param newValue The cf-ui API base URL
   */
  setBaseUrl: (newValue: string) => void,

  /**
   * @returns `true` if the API base URL is set.
   */
  hasBaseUrl: () => boolean,

  /**
   * Initialize the cf-ui API
   *
   * If you omit a parameter, we will try to autodetect it.
   * For `token`, we try to find it on the query string. Ex: `?token=your_api_token`.
   * For `baseUrl`, we try to find it from the referrer.
   *
   * @param token The cf-ui API token
   * @param baseUrl The cf-ui base URL. Eg: https://www.company.computablefacts.com
   *
   * @see [[`hasAutodetect`]]
   */
  init: (token?: string, baseUrl?: string) => void,

  /**
   * @return `true` if API token and base URL has been automatically detected by [[`init`]]
   */
  hasAutodetect: () => boolean,

  /**
   * Returns the materialized facts based on your SQL request.
   *
   * Example:
   * ```javascript
   * cf.api.materializeSql({
   *     query: 'SELECT name, count(*) As Total FROM materialized_facts GROUP BY name',
   *     format: 'arrays_with_header',
   * }).then(response => {
   *     this.results = response.data
   * }).catch(error => {
   *     console.error('materializeSql error=', error)
   * })
   * ```
   *
   * @param config The parameters for materialize SQL API.
   * @see [[`materializeSqlConfig`]]
   */
  materializeSql: (config: materializeSqlConfig) => Promise<Response>,
}

export {CfApiInterface, materializeSqlConfig}
