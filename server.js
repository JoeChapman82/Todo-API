var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// This from body-parser middlewhere to use req.body
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

// GET request /todos
app.get('/todos', function(req, res) {
  return res.json(todos);
  // res.json converts response to json (shorter than JSON.stringify)
});

app.get('/todos/:id', function(req, res) {
  /// GET /todos/:id (to get parts)
  var todoId = parseInt(req.params.id, 10);
  // Use parseInt as req.params returns a string
  var matchedTodo;
    todos.forEach(function(todo) {
      //where todo is the loop index item of the array the for each runs through
      if (todoId === todo.id) {
        matchedTodo = todo;
      }
    });
    if (matchedTodo) {
      res.json(matchedTodo);
    } else {
      res.status(404).send();
    }
});

// Challenge
// Add the body to the todos array
// along with whatevers set. Add an Id field and set
// it to todoNextIdinto todos request
// add id field
// push body into array
// return todo item

// POST /todos
app.post('/todos', function(req, res) {
  var body = req.body;
  body.id =  todoNextId++; // This sets value to body THEN increments the value
  todos.push(body);
res.json(body);
});


app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
