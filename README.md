# gatsby-source-rest-api

Source data into your gatsby site from many Rest APIs at once. Get all the data you want, but remove all the uneccessary clutter.

This plugin creates nodes from Rest APIs. You can use multiple APIs at once, or you can select only the endpoints you need from a single source, or do both so you can build your site with exactly the data you need.

## Install

`npm install --save gatsby-source-rest-api`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    //This plugin exists only once but can consume an array of endpoints
    {
      resolve: 'gatsby-source-rest-api',
      options: {
        urls: [
          ...
        ],
      },
    },
  ],
}
```

## Options

Options accepts only an array of urls and you must pass at least one. The most basic form of a url is a string, which will simply fetch the data from that url.

```js
urls: [
  "https://api.spacex.land/rest/capsules",
]
```

More complex settings can be passed as an object, giving you more control while consuming your APIs.

```js
urls: [
  {
    prefix: "SpaceX", //Overrides default "RestApi___" - optional
    baseUrl: "https://api.spacex.land/rest/", //the base of the rest api
    endpoints: ["rockets", "ships", "dragon/dragon1"], //the endpoints you wish to source from the baseUrl, in the event you don't want everything available
  },
],
```

## How to query

You can query file nodes by accessing the "allRestApi___" prefixed nodes:

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

If you use the optional _prefix_ setting, the node will be prefixed with your customised string. Each endpoint will be a separate node.

```graphql
{
  allSpaceXRockets {
    ...
  }
  allSpaceXShips {
    ...
  }
}
```


There is no set results list as this is wholely dependent on the API you're querying. Here's an example using the data sourced from `https://api.spacex.land/rest/rockets`

```graphql
{
  allSpaceXRockets { //customized
    edges {
      node {
        active
        boosters
        company
        cost_per_launch
        country
        ...
      }
    }
  }
}
```

## Out of scope

Authentication has been considered but given how diverse different authentication options can be, there's no reasonable way to apply it which will be effective across lots of different types of api's.

## Dependencies

This package is not dependent on any external packages.
Babel and Cross-Env are used during the build process.

## Contributions

Code contributions or suggestions will be welcomed. I'm excited to make this plugin better and need your help to do so. If you have any ideas, or find any bugs then create an issue. If you want to make some changes then feel free to open a PR.
