const express = require("express");

const mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quizapp"
});

var app = express();
var path = require("path");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/static", express.static(path.join(__dirname, "../", "public")));

app.listen(3000, function() {
  console.log("listening to 3000");
});

app.get("/", (req, res) => {
  res.sendFile("login.html", {
    root: path.join("__dirname", "../", "../client")
  });
});

app.post("/next", (req, res) => {
  const { uname, psw } = req.body;
  let sql = `select * from admins where un= '${uname}' and pw= '${psw}'`;
  let sql1 = `select * from asers where un= '${uname}' and pw= '${psw}'`;
  if (req.body.grp == "Admin") {
    db.query(sql, (err, result) => {
      if (err) {
        res.send("error");
      } else if (result.length == 0) {
        res.send("incorrect username or password");
      } else {
        res.sendFile("admin.html", {
          root: path.join("__dirname", "../", "../client")
        });
      }
    });
  } else {
    db.query(sql1, (err, result) => {
      if (err) {
        res.send("error");
      } else if (result.length == 0) {
        res.send("incorrect username or password");
      } else {
        res.sendFile("user.html", {
          root: path.join("__dirname", "../", "../client")
        });
      }
    });
  }
});

app.post("/postQuestion", (req, res) => {
  console.log("THe message is:");
  console.log(req.body);
  res.json({ msg: "jai ganesh" });
});
