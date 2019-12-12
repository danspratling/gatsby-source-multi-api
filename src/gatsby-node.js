const fetch = require("node-fetch")
exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  const { endpoints } = configOptions
  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  //strips special characters and makes string camelcase
  const customFormat = str => {
    return str
      .replace(/^.*\/\/[^\/]+/, "") //Removes domain
      .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()) //Capitalizes strings
      .replace(/\//g, "") //Removes slashes
      .replace(/\s+/g, "") //Removes spaces
  }

  // Helper function that processes a result to match Gatsby's node structure
  const processResult = (result, endpoint) => {
    //psuedo code
    //by default dont change ID
    //if(option to keep change id == true )
    // createNodeID
    //else 
    // use original id
    
    if(changeID === true){
      const nodeId = createNodeId(`rest-api-result-${result.id}`)
    } else{
      const nodeId = ${result.id}
    }
    
    const nodeContent = JSON.stringify(result)
    const nodeData = Object.assign({}, result, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `RestApi${customFormat(endpoint)}`,
        content: nodeContent,
        contentDigest: createContentDigest(result),
      },
    })
    return nodeData
  }

  const sources = []
  endpoints.forEach(endpoint =>
    sources.push(
      fetch(`${endpoint}`, {})
        .then(response => response.json())
        .then(data => {
          Array.isArray(data)
            ? data.forEach(result => {
                const nodeData = processResult(result, endpoint)
                createNode(nodeData)
              })
            : createNode(processResult(data, endpoint))
        })
    )
  )
  
  const changeID = true;

  return Promise.all(sources, changeID)
}
