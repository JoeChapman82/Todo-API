var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
// using the _ symbol for this node module is common apparantly

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// This from body-parser middlewhere to use req.body
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
  return res.json(todos);
  // res.json converts response to json (shorter than JSON.stringify)
});

app.get('/todos/:id', function(req, res) {
  /// GET /todos/:id (to get parts)
  var todoId = parseInt(req.params.id, 10);
  // Use parseInt as req.params returns a string
  var matchedTodo = _.findWhere(todos, {id: todoId});
    if (matchedTodo) {
      res.json(matchedTodo);
    } else {
      res.status(404).send();
    }
});

app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
      // if completed isn't a boolean or description isn't a string
      // .trim cuts out leading and trailing spaces
      // This using methods from underscore library - see documentation at underscore.js
      return res.status(400).send();
    }
  body.description = body.description.trim();
  body.id =  todoNextId++; // This sets value to body THEN increments the value
  todos.push(body);
res.json(body);
});


app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
