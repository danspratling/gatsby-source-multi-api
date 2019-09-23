# gatsby-source-rest-api

A Gatsby source plugin for sourcing data into your Gatsby appliction from any REST Api

The plugin creates `RestApi` nodes from REST API sources. You can source multiple REST
APIs at once using this plugin to get data from multiple endpoints (from a single or multiple domains).

This plugin is still under development and may change dramatically until version 1.0.0 is released (stable). Use at your own risk.

## Install

`npm install --save gatsby-source-rest-api`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    //This plugin exists only once but can consume an array of endpoints
    {
      resolve: 'gatsby-source-rest-api',
      options: {
        endpoints: [
          ...
        ],
      },
    },
  ],
}
```

## Options

Options accepts only an array of endpoints. You must pass at least one endpoint. Test these examples out if you wish, they will provide demo results

```
endpoints: [
  'https://jsonplaceholder.typicode.com/posts',
  'https://jsonplaceholder.typicode.com/users',
]
```

## How to query

You can query file nodes like the following:

```graphql
{
  allRestApiYourEndpointUri {
    edges {
      node {
        ...
      }
    }
  }
}
```

There is no set results list as this is wholely dependent on the API you're querying. Here's an example using the data sourced from `https://jsonplaceholder.typicode.com/posts`

```graphql
{
  allRestApiPosts {
    edges {
      node {
        userId
        title
        body
      }
    }
  }
}
```

Example of filtering by the `title`. This is dependent on the API used

```graphql
{
  allRestApiPosts(filter: { title: { eq: "qui est esse" } }) {
    edges {
      node {
        title
        body
      }
    }
  }
}
```

## Todo

This plugin is still a work in development and as such requires some additional features. Suggestions are welcomed.

- Implement a way to pass keys to APIs for situations where APIs require auth
