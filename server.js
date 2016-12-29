var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
  id: 1,
  description: 'Meet mum for lunch',
  completed: false
},
{
  id: 2,
  description: 'Go to market',
  completed: false
},
{
  id: 3,
  description: 'Complete task for node video',
  comlpleted: true
}];

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

// GET request /todos
app.get('/todos', function(req, res) {
  return res.json(todos); // converts response to json (instead of using json stingify)
});

app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;
    todos.forEach(function(todo) {
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
/// GET /todos/:id    (to get parts of thing)

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
