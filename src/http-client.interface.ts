/**
 * Config for materialized concepts SQL API request
 */
type materializedConceptsSqlQueryConfig = {

    /**
     * SQL Query.
     *
     * Example:
     *
     * For this SQL query:
     * ```sql
     * SELECT *
     * FROM materialized_concepts
     * LIMIT 0, 100
     * ```
     * Write:
     * ```javascript
     * const config = {
     *     query: 'SELECT * FROM materialized_concepts LIMIT 0, 100'
     * }
     * ```
     */
    query: string,

    /**
     * SQL Query parameters.
     *
     * Example:
     *
     * ```sql
     * SELECT *
     * FROM materialized_concepts
     * WHERE name = :type
     * ```
     * This SQL query contains a parameter named `:type`.
     *
     * You can pass the parameter value with:
     * ```javascript
     * const config = {
     *     query: 'SELECT * FROM materialized_concepts WHERE name = :type',
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
     * By default, queries on materialized concepts return data in `objects` format, an array of JSON objects.
     * Each object is the SQL query row result.
     *
     * Others formats are :
     *
     * - `arrays` : each row is returned as an array.
     * - `csv` : each row is returned as a string where columns are comma separated (`,`).
     * - `arrays_with_header` : same as `arrays` but the first array contains column headers.
     * - `csv_with_header` : same as `csv` but the first string contains comma separated column headers (`,`).
     *
     */
    format?: 'objects' | 'arrays' | 'arrays_with_header' | 'csv' | 'csv_with_header',
}

/**
 * Config for concepts auto-completion API request
 */
type autocompleteConceptConfig = {

    /**
     * A caller-defined unique identifier. This identifier will be set back in the `id` attribute of the response.
     * This identifier can be used to reorder the responses returned by the server.
     */
    uuid: string,

    /**
     * A concept name as configured in the platform.
     */
    concept: string,

    /**
     * The list of concept properties where the terms will be matched against.
     */
    properties: string[],

    /**
     * The terms to match.
     */
    terms: string[],

    /**
     * By default, auto-complete queries on concepts return data in `objects` format, an array of JSON objects.
     * Each object represents a fact.
     *
     * Others formats are :
     *
     * - `facts` : each row is a fully-formed ProbLog clause.
     * - `arrays` : each row is returned as an array.
     * - `csv` : each row is returned as a string where columns are comma separated (`,`).
     * - `arrays_with_header` : same as `arrays` but the first array contains column headers.
     * - `csv_with_header` : same as `csv` but the first string contains comma separated column headers (`,`).
     *
     */
    format?: 'objects' | 'facts' | 'arrays' | 'arrays_with_header' | 'csv' | 'csv_with_header',

    /**
     * The maximum number of items that must be returned.
     */
    sample_size?: number,
}

interface HttpClientInterface {

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
     * Returns materialized concepts, i.e. facts, based on your SQL request.
     *
     * Example:
     *
     * ```javascript
     * cf.httpClient.queryMaterializedConcepts({
     *     query: 'SELECT * FROM materialized_concepts LIMIT 0, 100',
     *     format: 'arrays_with_header',
     * }).then(response => {
     *     this.results = response.data
     * }).catch(error => {
     *     console.error('queryMaterializedConcepts error=', error)
     * })
     * ```
     *
     * @param config The parameters needed to query materialized concepts.
     * @see [[`materializedConceptsSqlQueryConfig`]]
     */
    queryMaterializedConcepts: (config: materializedConceptsSqlQueryConfig) => Promise<Response>,

    /**
     * Return the current API user (based on API token).
     */
    whoAmI: () => Promise<Response>,

    /**
     * Trigger autocompletion on a given set of properties of a given concept.
     *
     * Example:
     * ```javascript
     * cf.httpClient.autocompleteConcept({
     *     uuid: 1,
     *     concept: 'address',
     *     properties: ['NUMERO_DE_RUE','RUE','COMPLEMENT_DE_RUE','CODE_POSTAL','VILLE'],
     *     terms: ['passa*'],
     *     sample_size: 15,
     * }).then(response => {
     *     this.results = response.results
     * }).catch(error => {
     *     console.error('queryMaterializedConcepts error=', error)
     * })
     * ```
     *
     * @param config The parameters needed to trigger autocompletion.
     * @see [[`autocompleteConceptConfig`]]
     */
    autocompleteConcept: (config: autocompleteConceptConfig) => Promise<Response>,
}

export {HttpClientInterface, materializedConceptsSqlQueryConfig, autocompleteConceptConfig}
