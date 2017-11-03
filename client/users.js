// Instastore
// database/file.js
// Anthony Krivonos
// 10/17/2017

// Global Imports
const fs = require('fs');

// Local Variables
const USERS =  `${__dirname}/data/users.json`;

// User Methods

let getUsername = (user) => {
      return user && user.username ? user.username : null;
}

let getPassword = (user) => {
      return user && user.password ? user.password : null;
}

let match = (p1, p2) => {
      return p1 == p2;
}

let get = () => {
      return new Promise((resolve, reject) => {
            fs.readFile(USERS, 'utf8', (err, data) => {
                  if (err) return reject();
                  resolve(data);
            });
      });
};

let create = (user) => {
      return new Promise((resolve, reject) => {
            get.then((users) => {
                  users.push(user);
                  fs.writeFile(USERS, users, (err) => {
                        if (err) return reject();
                        resolve(users);
                  });
            });
      });
};

let contains = (username) => {
      return new Promise((resolve, reject) => {
            get.then((data) => {
                  data.forEach(user => {
                        if (match(getUsername(user), username)) return resolve(user);
                  });
                  reject();
            }).catch(()=>reject());
      });
};

let login = (user) => {
      console.log("Logging in user.");
      return new Promise((resolve, reject) => {
            contains(username).then((usr) => {
                  if (match(getPassword(user), getPassword(usr))) resolve(user);
                  else reject();
            }).catch(() => {
                  create(user).then(()=>resolve(user)).catch(()=>reject());
            });
      });
}

// Exported Methods
module.exports = {
      login
};
