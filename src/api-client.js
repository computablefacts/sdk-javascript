function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async response => {
      if (response.ok) {
        return await response.json()
      } else {
        const errorMessage = await response.text()
        return Promise.reject(new Error(errorMessage))
      }
    })
}

export {client}
