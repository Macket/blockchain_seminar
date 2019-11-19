const crypto = require('crypto');
const TX = require('./transactionBuilder.js');
const { genKeys,  } = require('./utils.js');
const { redisSet } = require('./transactionBuilder');


const { privateKey, publicKey } = genKeys();

console.log(privateKey, publicKey);

output1 = TX.createOutput(100, publicKey);
output2 = TX.createOutput(150, publicKey);
output3 = TX.createOutput(20, publicKey);
const genesisTx = TX.createTx([], [output1, output2, output3], []);

console.log(genesisTx);


redisSet(genesisTx.id, genesisTx);
