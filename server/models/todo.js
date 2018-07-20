var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  //add a creator
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

//creating todos private,
//update todo model with creator to associate the todo, added authenticate to both routes, set the creator property
//equal to the id of the user. fetching the todos in .find using the creator property.

module.exports = {Todo};
