var express = require('express');
var bodyParser = require('body-parser'); // bodyParser is middlewhere for express (look up it's methids such as .urlencoded)
var _ = require('underscore'); // using the _ symbol for this node module is common apparantly
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var users = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
      where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
      where.completed = false;
    }
    if (query.hasOwnProperty('q') && (query.q.length > 0)) {
      where.description = {
        $like: '%' + query.q + '%'
      };
    }
  db.todo.findAll({where: where}).then(function(todos) {
    res.json(todos);
  }, function(e) {
    res.status(500).send();
  });
});
  // As above but using underscore with no db
  //   var queryParams = req.query;
//   var filteredTodos = todos;
//   if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
//     filteredTodos = _.where(filteredTodos, {completed: true});
//   } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
//     filteredTodos = _.where(filteredTodos, {completed: false});
//   }
//    if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
//      filteredTodos = _.filter(filteredTodos, function(todo){
//        return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase) > -1; });
//    }
//   return res.json(filteredTodos);
//   // res.json converts response to json (shorter than JSON.stringify)
// });

app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.findById(todoId).then(function(todo) {
    // double !! flips back to boolean value
  if (!!todo) {
    res.json(todo.toJSON());
  } else {
    res.status(404).send();
  }
}, function(e) {
  res.status(500).send();
});
});
    //      Same as above but with underscore, no db
  // var matchedTodo = _.findWhere(todos, {id: todoId});
  //   if (matchedTodo) {
  //     res.json(matchedTodo);
  //   } else {
  //     res.status(404).send();
  //   }
// });

app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(e) {
    res.status(400).json(e);
  });
  //        Same as above but using underscore instead:
  //   if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  //     return res.status(400).send();
  //   }
  // body.description = body.description.trim();
  // body.id =  todoNextId++; // This sets value to body THEN increments the value
  // todos.push(body);
res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.destroy({
    where: {
      'id': todoId
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No todo with that id'
      });
    } else {
      res.status(204).send();
    }
  }, function() {
    res.status(500).send();
  });
});
//      as above without sequelize but with underscore
//   var matchedTodo = _.findWhere(todos, {id: todoId});
//   if (!matchedTodo) {
//     res.status(404).json({"error": "No Todo found with that id"});
//   } else {
//   todos = _.without(todos, matchedTodo);
//   res.json(matchedTodo);
// }
// });

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};
  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }
  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }

  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
     todo.update(attributes).then(function(todo) {
       res.json(todo.toJSON());
     }, function(e) {
         res.status(400).json(e);
     });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  });
});

app.post('/users', function(req, res) {
  var body = _.pick(req.body, 'email', 'password');

  db.user.create(body).then(function(user) {
    res.json(user.toPublicJSON());
  }, function(e) {
    res.status(400).json(e);
  });
});


db.sequelize.sync().then(function() {
  app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
  });
});
