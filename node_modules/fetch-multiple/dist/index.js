"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (urls) {
  var keys = Object.keys(urls);
  var output = {};
  var promises = [];

  var _loop = function _loop(url) {
    promises.push(fetch(url).catch(function (error) {
      output[url] = error;
      return undefined;
    }));
  };

  for (var url in urls) {
    _loop(url);
  }

  return Promise.all(promises).then(function (values) {
    return values.forEach(function (response, index) {
      if (response) {
        response[urls[keys[index]]]().then(function (value) {
          output[keys[index]] = value;
        });
      }
    });
  }).then(function () {
    return output;
  });
};