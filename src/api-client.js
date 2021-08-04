function client(endpoint, {body, ...customConfig} = {}) {
  const headers = {'Content-Type': 'application/json'}
  const config = {
    method: 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }
  if (body) {
    if (config.method === 'GET' || config.method === 'DELETE') {
      endpoint += '?' + new URLSearchParams(body)
    } else {
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
