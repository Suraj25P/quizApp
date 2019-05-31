let output = `  <div>
                <br/>
                <br/>
                <input id= type="text" placeholder=" Question" class="question" />
                <input type="text" placeholder=" option a" class="question" />
                <input type="text" placeholder=" option b" class="question" />
                <input type="text" placeholder=" option c" class="question" />
                <input type="text" placeholder=" option d" class="question" />
                <input type="text" placeholder=" correct answer" class="question" />
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

//   var res= names.reduce(function(result, item, index ) {
//     result[index] = item; //a, b, c
//     return result;
//   }, {});

//  console.log(res);
//  var res1=JSON.stringify(res);
//  console.log(res1)
// var res2=JSON.parse(res1)
// console.log(res2)

fetch("/postQuestion", {
    method: "POST",
    body :res1,
    headers: {     
      "Content-Type": " application/json"
    }
  }
  )
    .then(res => res.json())
    .then(data => {
      console.log(data.msg);
    })
    .catch(err => {
      console.log(err);
})
}
