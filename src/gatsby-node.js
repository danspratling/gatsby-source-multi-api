const fetch = require('node-fetch')
exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  const { apis } = configOptions
  
  const { createTypes } = actions
  const typeDefs = `
   type multiApiSourcePeopleFaculty implements Node{
    testData: String
    appointment: String
    bio: String
    building: String
    consult_service: String
    experience: String
    grant_contract: String
    honor_award: String
    innovate_enterpreneur: String
    patent_invention: String
    pf_email: String
    pf_work_fax: String
    pf_first_name: String
    pf_last_name: String
    pf_work_phone: String
    pf_title: String
    pf_username: String
    website: String
    research: String
    room: String
    photo_base64: String
    notable_courses: String
    service_university {
      org: String
      member_type: String
    }
    service_professional {
      dataTest: String
      title: String
      org: String
    }
    education {
      degother: String
      dty_comp: String
      deg: String
      school: String
      state: String
      country: String
      major: String
    }
    member {
      org: String
      status: String
    }
    intellcont {
      contype: String
      contypeother: String
      journal_name: String
      pagenum: String
      status: String
      title: String
      volume: String
      publisher: String
      pubctyst: String
      issue: String
      dty_pub: String
      dty_acc: String
      dty_sub: String
      web_address: String
      intellcont_auth {
        faculty_name: String
        fname: String
        lname: String
      }
   }
  `
  createTypes(typeDefs)

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  const sources = []

  // Helper function that processes a result to match Gatsby's node structure
  const processResult = ({ result, endpoint, prefix }) => {
    const nodeId = createNodeId(`${endpoint}-${result.pf_username}`)
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

  const appendSources = ({ url, endpoint, prefix, method }) => {
    sources.push(
      fetchData(url, { method })
        .then(data => {
          if (Array.isArray(data)) {
            /* if fetchData returns multiple results */
            data.forEach(result => {
              const nodeData = processResult({
                result,
                endpoint,
                prefix,
              })
              createNode(nodeData)
            })
          } else {
            // Otherwise a single result has been returned
            const nodeData = processResult({
              result: data,
              endpoint,
              prefix,
            })
            createNode(nodeData)
          }
        })
        .catch(error => console.log(error))
    )
  }

  apis.forEach(api => {
    /* check if the api request is an object with parameters */
    if (typeof api === 'object') {
      const { prefix, baseUrl, endpoints, method = 'GET' } = api

      /* Add some error logging if required config options are mising */
      if (!baseUrl) {
        console.log('\x1b[31m')
        console.error(
          'error gatsby-source-rest-api option requires the baseUrl parameter'
        )
        console.log('')
        return
      }

      /* object is used and endpoints are set */
      if (endpoints && endpoints.length) {
        endpoints.forEach(endpoint => {
          appendSources({
            url:
              baseUrl[baseUrl.length - 1] === '/'
                ? `${baseUrl}${endpoint}`
                : `${baseUrl}/${endpoint}`,
            endpoint,
            prefix,
            method,
          })
        })
        return
      }

      /* object is used but no endpoints are set */
      appendSources({
        url: baseUrl,
        endpoint: baseUrl,
        prefix,
        method,
      })
      return
    }

    /* The default simply expects a api url as a string and no other options */
    if (typeof api === 'string') {
      if (api.length) {
        appendSources({
          url: api,
          endpoint: api,
          prefix: 'MultiApiSource',
          method: 'GET',
        })
      }
    }
  })

  return Promise.all(sources)
}

// Helper function to fetch data
const fetchData = async (url, options = {}) => {
  const response = await fetch(`${url}`, options)
  return await response.json()
}

//strips special characters and makes string camelcase
const customFormat = str => {
  return str
    .replace(/^.*\/\/[^\/]+/, '') //Removes domain
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()) //Capitalizes strings
    .replace(/\//g, '') //Removes slashes
    .replace(/\-+/g, '') //Removes hyphens
    .replace(/\s+/g, '') //Removes spaces
}
