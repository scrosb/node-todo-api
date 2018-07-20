var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
  //load a separate JSON file with test and dev variables
  //when you require jSON it parses it into a javascript object
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });//takes all the object keys and returns as an array

  console.log(config);
}

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
// }

//as we addd secrets and 3rd party API keys, you do not want that to be added
//prod variables will be used on the heroku cli or prod environment