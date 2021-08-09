/**
 * Config for materializeSql API request
 */
type materializeSqlConfig = {
  /**
   * SQL Query.
   *
   * Example:
   *
   * For this SQL query:
   * ```sql
   * SELECT name, count(*) As Total
   * FROM materialized_facts
   * GROUP BY name
   * ```
   * Write:
   * ```javascript
   * const config = {
   *     query: 'SELECT name, count(*) As Total FROM materialized_facts GROUP BY name'
   * }
   * ```
   */
  query: string,

  /**
   * SQL Query parameters.
   *
   * Example:
   * ```sql
   * SELECT * FROM materialized_facts
   * WHERE name = :type
   * ```
   * This SQL query contains a parameter named `:type`.
   *
   * You can pass the parameter value with:
   * ```javascript
   * const config = {
   *     query: 'SELECT * FROM materialized_facts WHERE name = :type',
   *     params: {
   *         type: 'my_type'
   *     }
   * }
   * ```
   */
  params?: {
      [index: string]: string,
  },

  /**
   * By default, materializeSql returns data in `objects` format, an array of JSON objects.
   * Each object is the SQL query row result.
   *
   * Others possibles formats are :
   *
   * - `arrays` : each row is returned as an array.
   * - `csv` : each row is returned as a string where columns are comma separated (`,`).
   * - `arrays_with_header` : same as `arrays` but the first array contains column headers.
   * - `csv_with_header` : same as `csv` but the first string contains comma separated column headers (`,`).
   *
   */
  format?: 'objects' | 'arrays' | 'arrays_with_header' | 'csv' | 'csv_with_header',
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

  /**
   * Return the current API user (based on API token).
   */
  whoAmI: () => Promise<Response>,

}

export {CfApiInterface, materializeSqlConfig}
