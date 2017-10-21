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
      "tools"
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
};

let readDir = (firstDocClbk) => {
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
            });
            doclist.innerHTML = htmlList;
      });
}

let parseDocName = (name) => {
      return name.substring(0, name.indexOf('.json'));
}

let setCurrentDoc = (doc) => {
      clientRole.get(`http://localhost:8082/read/${doc}/${renderer.getEndpoint()}`).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4), 1);
            document.getElementById("doc").innerHTML = doc;
      }).catch(() => {
            editor.setValue("", -1);
      });;
}

let getDoc = () => {
      return document.getElementById('doc').innerHTML;
}

let getEndpoint = () => {
      return document.getElementById('endpoint').value;
}

const renderer = {
      viewDidLoad, toggle, readDir, parseDocName, setCurrentDoc, getDoc, getEndpoint
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
}

let save = () => {
      let doc = renderer.getDoc(), endpoint = renderer.getEndpoint();
      clientRole.post(`http://localhost:8082/create/${doc}/${endpoint}`, editor.getValue()).then((data) => {
            editor.setValue(JSON.stringify(data, null, 4), 1);
      });
}

const basic = {
      refresh, save
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
}

let post = (url, data) => {
      return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener("readystatechange", function () {
                  if (this.readyState == 4 && this.status == 200) {
                        alert(data + "\n" + this.responseText);
                        resolve(JSON.parse(data), this.status);
                  } else if (this.status == 500) reject();
            });
            xhttp.open("POST", url, true);
            xhttp.send(data);
      });
}

const clientRole = {
      get, post
};
