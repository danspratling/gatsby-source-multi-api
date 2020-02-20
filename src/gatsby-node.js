const fetch = require('node-fetch')
exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  const { urls } = configOptions
  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  //strips special characters and makes string camelcase
  const customFormat = str => {
    return str
      .replace(/^.*\/\/[^\/]+/, '') //Removes domain
      .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()) //Capitalizes strings
      .replace(/\//g, '') //Removes slashes
      .replace(/\-+/g, '') //Removes hyphens
      .replace(/\s+/g, '') //Removes spaces
  }

  // Helper function that processes a result to match Gatsby's node structure
  const processResult = ({ result, endpoint, prefix = `RestApi` }) => {
    const nodeId = createNodeId(`${endpoint}-${result.id}`)
    const nodeContent = JSON.stringify(result)
    const nodeData = Object.assign({}, result, {
      id: nodeId,
      endpointId: result.id,
      parent: null,
      children: [],
      internal: {
        type: `${prefix}${customFormat(endpoint)}`,
        content: nodeContent,
        contentDigest: createContentDigest(result),
      },
    })

    return nodeData
  }

  // Helper function to fetch data
  const fetchData = async (url) => {
    const response = await fetch(`${url}`, {})
    return await response.json()
  }


  const sources = []
  urls.forEach(url => {

    /** if url is a string, just process like normal */
    if (typeof (url) === "object") {
      const { prefix, baseUrl, endpoints } = url

      /* Add some error logging if config options are mising */
      if (!baseUrl) {
        console.log('\x1b[31m')
        console.error("error gatsby-source-rest-api option requires baseUrl")
      }

      if (!endpoints) {
        console.log('\x1b[31m')
        console.error("error gatsby-source-rest-api option requires at least 1 endpoint")
      }

      if (!baseUrl || !endpoints) {
        console.log('')
        return
      }

      /* proceed if we have the correct params available */
      endpoints.forEach(endpoint => {
        const url = baseUrl[baseUrl.length - 1] === '/' ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`

        sources.push(
          fetchData(url).then(data => {
            if (Array.isArray(data)) { /* if fetchData returns multiple results */
              data.forEach(result => {
                const nodeData = processResult({
                  result,
                  endpoint,
                  prefix
                })
                createNode(nodeData)
              })
            } else { // Otherwise a single result has been returned
              const nodeData = processResult({
                result: data,
                endpoint,
                prefix
              })
              createNode(nodeData)
            }
          }).catch(error => console.log(error))
        )
      })
      return
    }

    /* The default simply expects a url as a string */
    sources.push(
      fetchData(url).then(data => {
        data.forEach(result => {
          const nodeData = processResult({
            result,
            endpoint: url
          })
          createNode(nodeData)
        })
      })
    )
  })


  return Promise.all(sources)
}
