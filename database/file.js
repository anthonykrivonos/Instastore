// Instastore
// database/file.js
// Anthony Krivonos
// 10/17/2017

// Global Imports
const fs = require('fs');

// Local Imports
const utility = require('./utility.js');

// Local Variables
const STORAGE =  `${__dirname}/storage/`;
const EXTENSION =  `.json`;

// CRUD Methods

let create = (file, address, body) => {
      return new Promise((resolve, reject) => {
            if (address == null) address = "";
            if (file == null || body == null) return reject();
            console.log(`Creating document at ${file}/${address}.`)
            fs.readFile(`${STORAGE}${file}${EXTENSION}`, 'utf8', (err, data) => {
                  let doc = utility.overwrite(utility.verify(data), body, utility.propertyFromString(address));
                  fs.writeFile(`${STORAGE}${file}${EXTENSION}`, utility.beautify(doc), (err) => {
                        if (err) return reject();
                        resolve(doc);
                  });
            });
      });
};

let read = (file, address) => {
      return new Promise((resolve, reject) => {
            if (address == null) address = "";
            if (file == null) {
                  console.log(`Reading entire ${STORAGE} directory`);
                  fs.readdir(STORAGE, (err, dir) => {
                        if (err) return reject();
                        resolve({dir});
                  });
            } else {
                  console.log(`Reading document at ${file}/${address}`);
                  fs.readFile(`${STORAGE}${file}${EXTENSION}`, 'utf8', (err, data) => {
                        if (err) return reject();
                        let doc = utility.subProperty(data, utility.propertyFromString(address));
                        resolve(doc);
                  });
            }
      });
};

let update = (file, address, body) => {
      return new Promise((resolve, reject) => {
            if (address == null) address = "";
            if (file == null || body == null) return reject();
            console.log(`Updating document at ${file}/${address}.`)
            fs.readFile(`${STORAGE}${file}${EXTENSION}`, 'utf8', (err, data) => {
                  if (err) return reject();
                  let doc = utility.append(utility.verify(data), body, utility.propertyFromString(address));
                  fs.writeFile(`${STORAGE}${file}${EXTENSION}`, utility.beautify(doc), (err) => {
                        if (err) return reject();
                        resolve(doc);
                  });
            });
      });
};

let del = (file, address) => {
      return new Promise((resolve, reject) => {
            if (address == null) address = "";
            if (file == null) return reject();
            if (address == "") {
                  fs.unlink(`${STORAGE}${file}${EXTENSION}`, (err) => {
                        if (err) return reject();
                        resolve({});
                  });
            } else {
                  fs.readFile(`${STORAGE}${file}${EXTENSION}`, 'utf8', (err, data) => {
                        if (err) return reject();
                        let doc = utility.remove(utility.verify(data), utility.propertyFromString(address));
                        fs.writeFile(`${STORAGE}${file}${EXTENSION}`, utility.beautify(doc), (err) => {
                              if (err) return reject();
                              resolve(doc);
                        });
                  });
            }
      });
};

let query = (file, address, query) => {
      return new Promise((resolve, reject) => {
            if (address == null) address = "";
            console.log(`Querying document at ${file}/${address}`);
            fs.readFile(`${STORAGE}${file}${EXTENSION}`, 'utf8', (err, data) => {
                  if (err) return reject();
                  let doc = utility.query(utility.subProperty(data, utility.propertyFromString(address)), query);
                  resolve(doc);
            });
      });
};

// Exported Methods
module.exports = {
      create, read, update, del, query
};
