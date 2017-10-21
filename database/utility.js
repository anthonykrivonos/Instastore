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
      if (property.length > 0) {
            property = property.replace(/\//g, ".");
            if (property.charAt(0) != '.') property = `.${property}`;
            if (property.charAt(property.length-1) == '.') property = property.substring(0, property.length - 1);
      }
      return property;
};

let subProperty = (object, property) => {
      eval(`
            object = ${object};
            var obj = object${property}
      `);
      return obj;
}

let overwrite = (object, overwrite, property) => {
      property = property.split('.');
      property.shift();
      var cur = object, last = property.pop();
      property.forEach((prop) => {
            cur[prop] = {};
            cur = cur[prop];
      });
      cur[last] = overwrite;
      return verify(object);
};

let append = (object, append, property) => {
      console.log(`Current object: ${JSON.stringify(object, null, 2)}`)
      property = property.split('.');
      property.shift();
      var cur = object, last = property.pop();
      console.log(`Current object: ${JSON.stringify(object, null, 2)}`)
      property.forEach((prop) => {
            cur[prop] = {};
            cur = cur[prop];
      });
      cur[last] = object[last] ? Object.assign(object[last], append) : append;
      console.log(`Current object: ${JSON.stringify(object, null, 2)}`)
      return verify(object);
};

let remove = (object, property) => {
      eval(`delete object${property}`);
      return verify(object ? object : {});
};

// Exported Methods
module.exports = {
      beautify, verify, propertyFromString, subProperty, overwrite, append, remove
};
