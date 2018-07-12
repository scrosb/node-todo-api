var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true}).catch(e => {
    console.log(e);
})

module.exports = {mongoose};

//we will have a development, test, and production environment
