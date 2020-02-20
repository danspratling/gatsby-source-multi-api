# gatsby-source-multi-api

Source data into your gatsby site from many Rest APIs at once. Get all the data you want, but remove all the uneccessary clutter.

This plugin creates nodes from Rest APIs. You can use multiple APIs at once, or you can select only the endpoints you need from a single source, or do both so you can build your site with exactly the data you need.

## Install

`npm install --save gatsby-source-multi-api`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    //This plugin exists only once but can consume an array of endpoints
    {
      resolve: 'gatsby-source-multi-api',
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
urls: ['https://api.spacex.land/rest/capsules']
```

More complex settings can be passed as an object, giving you more control while consuming your APIs.

```js
urls: [
  {
    prefix: "SpaceX",
    baseUrl: "https://api.spacex.land/rest/",
    endpoints: ["rockets", "ships", "dragon/dragon1"],
    method: "OPTIONS",
  },
],
```

You can exclude the endpoints array to give you more control over a single endpoint too

```js
urls: [
  {
    prefix: "SpaceX",
    baseUrl: "https://api.spacex.land/rest/landpads",
  },
],
```

| **Name**  | **Type**      | **Description**                                                                                                          |
| :-------- | :------------ | :----------------------------------------------------------------------------------------------------------------------- |
| prefix    | string        | `Optional` Prefix for your node. Will override the default prefix "multiApiSource[endpoint]"                             |
| baseUrl   | string        | `Required` The base url for your api call. This should be domain + endpoint if you choose to exclude the endpoints array |
| endpoints | array[string] | `Optional` The endpoints you require for your url. baseUrl + endpoint should return json data                            |
| method    | string        | `Optional` For occasions where you might not want to GET request, you can specify another method.                        |

## How to query GraphQL

You can query file nodes by accessing the "allMultiApi" or "multiApi" prefixed nodes:

```graphql
{
  allMultiApiRockets {
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
  allSpaceXRockets {
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
