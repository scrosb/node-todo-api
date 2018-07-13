const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//hashing
//gensalt

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });
//we are going to fetch the hashed password out of the database, then compare to the plaintext password
var hashedPassword = '$2a$10$uhIPdwpY83U.b.AnMa7JvulRViW/MP2Slv7VKrn8RAaIdnTYQDhfW';

bcrypt.compare('123!', hashedPassword, (err, res) => {
    console.log(res);
})

// var data = {
//     id:10
// }

// var token = jwt.sign(data, 'hsdfgsdfsdfsdfgsdfgsdfgsdfgsdfgSADFQ');

// console.log(token);

// var decoded = jwt.verify(token, 'hsdfgsdfsdfsdfgsdfgsdfgsdfgsdfgSADFQ');

// console.log('Decoded:', decoded);
// jwt.verify


// var message = 'I am user number 3';

// var hash = SHA256(message).toString();

// console.log(`${message}: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+ 'somesecret').toString()
// }


// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash =  SHA256(JSON.stringify(token.data) + 
// 'somesecret').toString();



// if(resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('Data was Changed. Do not trust')
// }