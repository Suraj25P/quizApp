let output = `  <div>
                <br/>
                <br/>
                <input id= type="text" placeholder=" Question" class="question" />
                <input type="text" placeholder=" option a" class="question" />
                <input type="text" placeholder=" option b" class="question" />
                <input type="text" placeholder=" option c" class="question" />
                <input type="text" placeholder=" option d" class="question" />
                <input type="text" placeholder=" correct answer" class="question" />
                <input type="number" placeholder=" Marks for this question" class="question" />
                <br/>
                <br/>
                <hr/>
                </div>`;

function getTemplate() {
  let n = document.getElementById("no").value;
  for (i = 0; i < n; i++) {
    let node = document.createElement("div");
    node.innerHTML = output;
    document.getElementById("questionHolder").appendChild(node);
  }
}

function nyfunc() {
  var elem = document.getElementsByClassName("question");
  var names = [];
  for (var i = 0; i < elem.length; ++i) {
    if (typeof elem[i].value !== "undefined") {
      names.push(elem[i].value);
    }
  }

  fetch("/postQuestion", {
    method: "POST",
    body: JSON.stringify(names),
    headers: {
      "Content-Type": " application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("msgholder").innerHTML = data.msg;
    })
    .catch(err => {
      console.log(err);
    });
}

//******************************************** */USER CLIENT-SIDE JAVASCRIPT
function attemptChecker() {
  let qid = document.getElementById("quizID").value;
  fetch("/getQuestion", {
    method: "POST",
    body: qid,
    headers: {
      "Content-Type": " text/plain"
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("msgHolder1").innerHTML = data.msg;
    })

    .catch(err => {
      console.log(err);
    });
}

function takeTest() {
  let qid = document.getElementById("quizID").value;
  fetch("/takeTest", {
    method: "POST",
    body: JSON.stringify({ qid: qid }),
    headers: {
      "Content-Type": " application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      for (i = 0; i < data.length; i++) {
        let output = `  <div>
                <br/>
                <br/>
                <input id= type="text"  class="question" value='${data[i].question}'/>
                <br/>
                <label for="a">Option A</label>
                <input id="a" type="text"  class="question" value='${data[i].opa}'/>
                <br/>
                <label for="b">Option B</label>
                <input id="b" type="text"  class="question" value='${data[i].opb}' />
                <br/>
                <label for="c">Option C</label>                
                <input id="c" type="text"  class="question" value='${data[i].opc}'/>
                <br/>
                <label for="d">Option D</label>
                <input id="d" type="text"  class="question" value='${data[i].opd}'/>
                <br/>
                <input type="text"  placeholder="Enter correct answer" class="answer" />
                <br/>
                <label for="m">Marks:</label>
                <input id="m" type="number"  class="question" value='${data[i].mpq}' />
                <br/>
                <br/>
                <hr/>
                </div>`;
        let node = document.createElement("div");
        node.innerHTML = output;
        document.getElementById("questionPaperHolder").appendChild(node);
      }
       let button=`<button onClick="submitTest()">Submit</button>`
       let node = document.createElement("div");
        node.innerHTML = button;
        document.getElementById("questionPaperHolder").appendChild(node);
    })

    .catch(err => {
      console.log("error1j");
      console.log(err);
    });
}


//****************************************Score calculation ********************************/
function submitTest(){
  var elem = document.getElementsByClassName("answer");
  var answers = [];
  for (var i = 0; i < elem.length; ++i) {
    if (typeof elem[i].value !== "undefined") {
      answers.push(elem[i].value);
    }
  }

  fetch("/submitTest", {
    method: "POST",
    body: JSON.stringify(answers),
    headers: {
      "Content-Type": " application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("msgholder").innerHTML = data.msg;
    })
    .catch(err => {
      console.log(err);
    });

}
