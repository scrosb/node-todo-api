require('../config/config.js');
//adding if else statements to configure our environment

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
var {authenticate} =  require('./middleware/authenticate');



var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }



    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //pick allows you to remove properties from an object
  var body = _.pick(req.body, ['text', 'completed']); 
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set:body}, {new: true})
  .then((todo) => {
    if(!todo) {
      return res.status(404);
    }

    res.send({todo});
  }).catch(e => {
    res.status(400).send();
  })
});



// POST /users

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
    //make sure database is dropped so validator works
    var user = new User(body);

    //model methods and instance methods
    user.save().then(() => {
      return user.generateAuthToken();
      //res.send(user)
    }).then((token) => {
      //user variable above is not the same as the user variable defined here
      //when you prefix a header with x-auth you're creating a custom header
      res.header('x-auth', token).send(user);
    }).catch((e) =>{
      res.status(400).send(e);
    });   
});

//this route is going to receive a token, find the valid user, then send that user back

//we want to break out this route into some middleware




app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

//POST /users/login {email, password} //login has an email and password that equals the email an password in our database
//no authenticate you do not have a token
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  
  //1. verify a user exists with that email, then get the password property
  //create another model method called find by credentials
  //write the user method first to figure out exactly what he wants the method to do
  User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
  }).catch((e) => {
    res.status(400).send();
  });

});


//make the route private, we store the token inside authenticate
app.delete('/users/me/token', authenticate, (req, res) => {
  //instance method

  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
