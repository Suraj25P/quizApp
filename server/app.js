const express = require("express");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quizapp"
});

var quizdb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quizes"
});

var app = express();
var path = require("path");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());

app.use("/static", express.static(path.join(__dirname, "../", "public")));

app.listen(3000, function () {
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
  let sql1 = `select * from users where un= '${uname}' and pw= '${psw}'`;
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
    res.cookie("sid", uname);

    db.query(sql1, (err, result) => {
      if (err) {
        res.send("error");
        console.log(err);
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
  let sql3 = `select * from ${req.body[0]}`;
  quizdb.query(sql3, (err, result) => {
    if (err) {
      let sql4 = `CREATE TABLE ${req.body[0]} (
        question varchar(20),
        opa varchar(20),
        opb varchar(20),
        opc varchar(20),
        opd varchar(20),
        cans varchar(20),
        mpq int
      );`;
      quizdb.query(sql4, (err, result) => {
        if (err) {
          res.json({ msg: "coudnt create Quiz...try again" });
        } else {
          var n = req.body[1];
          var o = 0;
          for (i = 0; i < n; i++) {
            let sql5 = `INSERT INTO ${req.body[0]} VALUES ( '${
              req.body[2 + o]
              }' , '${req.body[3 + o]}','${req.body[4 + o]}', '${
              req.body[5 + o]
              }','${req.body[6 + o]}','${req.body[7 + o]}',${req.body[8 + o]});`;
            quizdb.query(sql5, (err, result) => {
              if (err) {
                res.json({ msg: "coudnt upload data!" });
              }
            });
            o += 7;
          }
          res.json({ msg: "Successfully created..!!" });
        }
      });
    } else {
      res.json({ msg: "this Quiz id already exists" });
    }
  });
});

app.post("/getQuestion", (req, res) => {

  let sql = `select * from scoreboard where qid='${req.body}' and sid='${
    req.cookies.sid
    }';`;
  db.query(sql, (err, result) => {
    if (result.length != 0) {
      res.json({
        msg: `you have already attempted this test and your score is ${
          result[0].score
          }`
      });
    }
  });
});
app.post("/takeTest", (req, res) => {
  var x = req.body.qid
  res.cookie('qid', x);
  let sql = `select * from ${req.body.qid}`;
  quizdb.query(sql, (err, result) => {
    if (err) {
      res.json({ msg: "This quiz doesnt exist yet..!" });
    } else {
      var x = { ...result }
      res.json(result);


    }
  });
});

app.post('/submitTest', (req, res) => {
  console.log(req.body);
  console.log(req.cookies.qid);
  console.log(req.cookies.sid);
  let sql = `select cans,mpq from ${req.cookies.qid}`;
  quizdb.query(sql, (err, result) => {
    if (result) {
      var score = 0;
      console.log(req.body.length);
      for (i = 0; i < req.body.length; i++) {
        if (req.body[i] == result[i].cans) {
          score = score + result[i].mpq;
        }
      }
      let sql1= `insert into scoreboard values(${req.cookies.qid} ,${req.cookies.sid},${score});`;
      db.query(sql1,(err,result)=>{
        if(err){
          res.json({msg:'something went worng..!!'})
        }else{
          res.json({msg:`your answer has been submitted and your score is ${score}`});
        }
      })
    }
  })

});