# fetch-multiple

A tiny library created for fetching multiple assets in one promise.

*Here are some basic instructions to get up and running*

```shell
$ npm install fetch-multiple --save-dev
```

```javascript
import fetchMultiple from 'fetch-multiple';

const fetchables = {
  '/data.json': 'json',
  '/text.txt': 'text'
};

fetchMultiple(fetchables)
  .then(data => {
    console.log(data);
  });

  // This function logs:
  // {
  //   '/data.json': { jsonResponse },
  //   '/text.txt': 'textResponse'
  // }
```

The only argument that the function requires is an object of URLs as keys and values of the desired parsing method.

Available parsing methods are based on what the fetch protocol is capable of:
```
- arrayBuffer
- blob
- formData
- json
- text
```

**Please note that this library's data structure may change as new features are added in newer releases.**