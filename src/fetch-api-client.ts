// @ts-ignore
// error TS2525: Initializer provides no value for this binding element and the binding element has no default value (body).
// error TS7031: Binding element 'body' implicitly has an 'any' type.
function client(endpoint: string, {body, ...customConfig} = {}): Promise<Response> {
    const headers = {'Content-Type': 'application/json'}
    const config = {
        method: 'GET',
        ...customConfig,
        headers: {
            ...headers,
            // @ts-ignore
            // error TS2339: Property 'headers' does not exist on type '{}'.
            ...customConfig.headers,
        },
    }
    if (body) {
        if (config.method === 'GET') {
            endpoint += '?' + new URLSearchParams(body)
        } else {
            // @ts-ignore
            // error TS2339: Property 'body' does not exist on type '{ headers: any; method: string; }'.
            config.body = JSON.stringify(body)
        }
    }
    return window
        .fetch(endpoint, config)
        .then(async response => {
            if (response.ok) {
                return await response.json()
            } else {
                const errorMessage = await response.json()
                return Promise.reject(new Error(errorMessage.error))
            }
        })
}

export {client}
