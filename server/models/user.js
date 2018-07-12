const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, //verifies that email is not used in another login
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not an email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require:true
    },
    token: {
      type:String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  //use a method override using pick
  var user = this;
  //to object convert your mongo json, where aonly the properties available to the document exists
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);

}

UserSchema.methods.generateAuthToken = function() {
  //we need a this keyword for our methods
  var user = this; //we're identifying this specifi user
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'jarjarbinks').toString();

  user.tokens = user.tokens.concat([{access,token}]);

  //the token value will be returned for the success call
  return user.save().then(() => {
    return token;//just returning a value
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User}
