const {ObjectID} = require('mongodb');

const jwt = require('jsonwebtoken');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId= new ObjectID;
const userTwoId = new ObjectID;
const users = [{
  _id: userOneId,
  email: 'silas@example.com',
  password: 'silasPass',
  tokens: [{
      access:'auth',
      token:jwt.sign({_id: userOneId, access:'auth'}, 'jarjarbinks').toString()
  }]
}, {
    _id:userTwoId,
    email:'si@example.com',
    password:'siPasssdfg',
    tokens: [{
      access:'auth',
      token:jwt.sign({_id: userTwoId, access:'auth'}, 'jarjarbinks').toString()
  }]
}];



const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
  }, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: 'true',
    completedAt: 333,
    _creator:userTwoId
  }];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }). then(() => done());
}

module.exports = {todos, populateTodos, users,  populateUsers};