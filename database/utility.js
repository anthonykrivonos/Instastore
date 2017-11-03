// Instastore
// database/utility.js
// Anthony Krivonos
// 10/17/2017

// Global Imports
const fs = require('fs');
const objectSearch = require('object-search');
const sortObj = require('sort-object');

// Local Variables
const BEAUTIFY_INDENTATION = 2;

// Utility Methods

let beautify = (object) => {
      return JSON.stringify(object ? (typeof object == 'object' ? object : JSON.parse(object)) : {}, null, BEAUTIFY_INDENTATION);
};

let verify = (object) => {
      if (!object) return {};
      return typeof object == 'object' ? object : JSON.parse(object);
}

let propertyFromString = (property) => {
      if (property && property.length > 0) {
            property = property.replace(/\//g, ".");
            if (property.charAt(0) != '.') property = `.${property}`;
            if (property.charAt(property.length-1) == '.') property = property.substring(0, property.length - 1);
            return property;
      }
      return "";
};

let subProperty = (object, property) => {
      eval(`
            object = ${object};
            var obj = object${property}
      `);
      return obj;
}

let overwrite = (object, overwrite, property) => {
      if (property && property.length > 0) {
            property = property.split('.');
            property.shift();
            var cur = object, last = property.pop();
            property.forEach((prop) => {
                  cur[prop] = {};
                  cur = cur[prop];
            });
            cur[last] = overwrite;
      } else object = overwrite;
      return verify(object);
};

let append = (object, append, property) => {
      if (property && property.length > 0) {
            property = property.split('.');
            property.shift();
            var cur = object, last = property.pop();
            property.forEach((prop) => {
                  cur[prop] = {};
                  cur = cur[prop];
            });
            cur[last] = object[last] ? Object.assign(object[last], append) : append;
      } else object = Object.assign(object, append);
      return verify(object);
};

let remove = (object, property) => {
      eval(`delete object${property}`);
      return verify(object ? object : {});
};

let query = (object, query) => {
      if (!query) return object;
      if (query.search && query.search != "") object = search(object, query.search);
      if (query.limit && query.limit.count > 0) object = limit(object, query.limit.direction, query.limit.count);
      if (query.order) object = order(object);
      return verify(object);
};

let search = (object, value) => {
      return objectSearch.find(object, value);
}

let limit = (object, direction, count) => {
      var newObject = [];
      if (direction == "first" && object instanceof Array) {
            for (var i = 0; i < count; i++) {
                  if (object[i]) newObject.push(object[i]);
                  else break;
            };
      }
      else if (object instanceof Array) {
            for (var i = count - 1; i >= 0; i--) {
                  if (object[i]) newObject.push(object[i]);
                  else break;;
            }
      }
      else newObject = object;
      return newObject;
}

let order = (object) => {
      return sortObj(object);
}

// Exported Methods
module.exports = {
      beautify, verify, propertyFromString, subProperty, overwrite, append, remove, query
};
