var express = require('express');
var bodyParser = require('body-parser'); // bodyParser is middlewhere for express (look up it's methids such as .urlencoded)
var _ = require('underscore'); // using the _ symbol for this node module is common apparantly

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// This
app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.send('Todo API Root');
});

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;
  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }
   if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
     filteredTodos = _.filter(filteredTodos, function(todo){
       return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase) > -1; });
   }
  return res.json(filteredTodos);
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

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (!matchedTodo) {
    res.status(404).json({"error": "No Todo found with that id"});
  } else {
  todos = _.without(todos, matchedTodo);
  res.json(matchedTodo);
}
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).send();
  }
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }
  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);

});


app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
