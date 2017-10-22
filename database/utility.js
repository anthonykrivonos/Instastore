// Instastore
// database/utility.js
// Anthony Krivonos
// 10/17/2017

// Global Imports
const fs = require('fs');

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
      if (query.search) object = search(object, query.search);
      if (query.limit) object = limit(object, query.limit);
};

let search = (object, value) => {
      var result = null;
      if (object instanceof Array) {
            for (var i = 0; i < object.length; i++) {
                  result = search(object[i]);
                  if (result) break;
            }
      } else {
            for (var prop in object) {
                  if (prop == value && object[prop] == 1) return object;
                  if (object[prop] instanceof Object || object[prop] instanceof Array) {
                        result = search(object[prop]);
                        if (result) break;
                  }
            }
      }
      return result;
}

let limit = (object, value) => {
      var result = null, newObject = [];
      if (object instanceof Array) for (var i = 0; i < value; i++) newObject.push(object[i]);
      else newObject = object;
      return newObject;
}

// Exported Methods
module.exports = {
      beautify, verify, propertyFromString, subProperty, overwrite, append, remove, query
};
