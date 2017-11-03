// Instastore
// client/app/renderer.js
// Anthony Krivonos
// 10/20/2017

//
//    Renderer
//

const OPTIONS = [
      "basic",
      "advanced",
      "query"
];

let viewDidLoad = () => {
      renderer.readDir();
      renderer.toggle('basic');
};

let toggle = (action) => {
      OPTIONS.forEach((opt) => {
            if (opt == action) {
                  Array.prototype.forEach.call(document.getElementsByClassName(opt), (el) => {
                        el.style.display = "inline-block";
                  });
            } else {
                  Array.prototype.forEach.call(document.getElementsByClassName(opt), (el) => {
                        el.style.display = "none";
                  });
            }
      });
      renderer.readDir();
};

let readDir = (callback) => {
      let dir = [];
      renderer.setEndpoint("");
      clientRole.get('http://localhost:8082/read/').then((data) => {
            let doclist = document.getElementById("doclist");
            let htmlList = ``;
            data.dir.sort(function (a, b) {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
            }).forEach((doc, i) => {
                  if (i == 0) setTimeout(()=>renderer.setCurrentDoc(doc), 1);
                  doc = renderer.parseDocName(doc);
                  htmlList += `
                        <li onclick="renderer.setCurrentDoc('${doc}')" class="doc-item list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                              ${doc}
                        </li>
                  `;
                  dir.push(doc.toLowerCase());
            });
            doclist.innerHTML = htmlList;
            if (callback) callback(dir);
      });
};

let parseDocName = (name) => {
      return name.substring(0, name.indexOf('.json'));
};

let setCurrentDoc = (doc) => {
      clientRole.get(`http://localhost:8082/read/${doc}/${renderer.getEndpoint()}`).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4), 1);
            document.getElementById("doc").innerHTML = doc;
      }).catch(() => {
            editor.setValue("", -1);
      });;
};

let getDoc = () => {
      return document.getElementById('doc').innerHTML;
};

let getEndpoint = () => {
      return document.getElementById('endpoint').value;
};

let getNewDoc = () => {
      return document.getElementById('newdoc').value;
};

let setEndpoint = (endpoint) => {
      document.getElementById('endpoint').value = endpoint;
};

let setNewDoc = (newDoc) => {
      document.getElementById('newdoc').value = newDoc;
};

let getQuery = () => {
      return {
            search: document.getElementById('search').value,
            limit: {
                  direction: document.getElementById('first').checked ? "first" : "last",
                  count: document.getElementById('count').value
            },
            order: document.getElementById('order').checked == true,
            save: document.getElementById('new').checked == true
      }
};

const renderer = {
      viewDidLoad, toggle, readDir, parseDocName, setCurrentDoc, getDoc, getEndpoint, getNewDoc, setEndpoint, setNewDoc, getQuery
};

//
//    Basic
//

let refresh = () => {
      let doc = renderer.getDoc(), endpoint = renderer.getEndpoint();
      clientRole.get(`http://localhost:8082/read/${doc}/${endpoint}`).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4), 1);
      }).catch(() => {
            editor.setValue("", -1);
      });
};

let save = (url = null) => {
      let doc = renderer.getDoc(), endpoint = renderer.getEndpoint();
      clientRole.post(url == null ? `http://localhost:8082/create/${doc}/${endpoint}` : `http://localhost:8082/create/${url}`, editor.getValue()).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4), 1);
      });
};

let newDoc = () => {
      renderer.readDir((dir) => {
            let doc = renderer.getNewDoc();
            if (!doc || doc.length <= 0 || dir.includes(doc.toLowerCase())) return;
            clientRole.post(`http://localhost:8082/create/${doc}`, basic.getEmpty()).then((data) => {
                  editor.setValue(JSON.stringify(data, null, 4), 1);
                  renderer.setNewDoc("");
                  setTimeout(() => renderer.readDir(), 1);
            });
      });
};

let getEmpty = () => {
      return JSON.stringify({


      });
};

const basic = {
      refresh, save, newDoc, getEmpty
};

//
//    Advanced
//

let update = () => {
      let doc = renderer.getDoc(), endpoint = renderer.getEndpoint();
      clientRole.post(`http://localhost:8082/update/${doc}/${endpoint}`, editor.getValue()).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4), 1);
      });
};

let del = () => {
      let doc = renderer.getDoc(), endpoint = renderer.getEndpoint();
      clientRole.get(`http://localhost:8082/delete/${doc}/${endpoint}`).then((data) => {
            editor.setValue("");
            setTimeout(() => renderer.readDir(), 1);
      }).catch(() => {
            editor.setValue("", -1);
      });
};

const advanced = {
      create: basic.save,
      read: basic.refresh,
      update,
      del
};

//
//    Query
//

let que = () => {
      let doc = renderer.getDoc(), endpoint = renderer.getEndpoint();
      clientRole.post(`http://localhost:8082/query/${doc}/${endpoint}`, JSON.stringify(renderer.getQuery())).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4));
            if (renderer.getQuery().save) {
                  var d = new Date();
                  basic.save(renderer.getDoc() + `${d.now()}/` + renderer.getEndpoint());
                  setTimeout(() => renderer.readDir(), 1);
            }
      }).catch(() => {
            editor.setValue("", -1);
      });
};

const query = {
      query: que
};

//
//    Client Role
//

let get = (url) => {
      return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener("readystatechange", function () {
                  if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.responseText), this.status);
                  } else if (this.status == 500) reject();
            });
            xhttp.open("GET", url, true);
            xhttp.send();
      });
};

let post = (url, data) => {
      return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener("readystatechange", function () {
                  if (this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.responseText), this.status);
                  } else if (this.status == 500) reject();
            });
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(data);
      });
};

const clientRole = {
      get, post
};
