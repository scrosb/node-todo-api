const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id:10
}

var token = jwt.sign(data, 'hsdfgsdfsdfsdfgsdfgsdfgsdfgsdfgSADFQ');

console.log(token);

var decoded = jwt.verify(token, 'hsdfgsdfsdfsdfgsdfgsdfgsdfgsdfgSADFQ');

console.log('Decoded:', decoded);
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