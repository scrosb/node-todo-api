const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
//instance methods get called with th eindividual document
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

//statics is kind of like methods
//model methods get called with the model as the this binding
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  //jwt will throw an error if something does not exist
  try {
    decoded = jwt.verify(token, 'jarjarbinks');
  } catch(e) {
    //always want to reject
    return Promise.reject();
  }
  //add some chaining by returning
  //find the user 
  return User.findOne({
    '_id':decoded._id,
    'tokens.token': token,
    'tokens.access':'auth'
  });

};

//use .statics for a model method

UserSchema.statics.findByCredentials = function(email, password) {
  //find a user where the email and password match the users
  var User = this;
    return User.findOne({email}).then((user) => {
    // console.log(user);
    if(!user) {
      //return unfulfilled promise
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      //use bcrypt.compare to user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        } else {
          return reject();
        }
    });
    })
  });
};

//hashes the password before sending the email back
UserSchema.pre('save', function(next) {
  var user = this;
  //we don't want to hash a password everytime a document is saved
  //we use this function

  //this function only checks if the password part of the user object is modified
  if(user.isModified('password')){
    //user.password
    //bcfypt.hash,

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
         user.password = hash;
         next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}
