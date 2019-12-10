const { genKeys, createSign, verifySign } = require('./cryptoUtils.js');

const { publicKey, privateKey } = genKeys();

const data = {'id': 1, 'payload': 'nonce'};

const signature = createSign(JSON.stringify(data), privateKey);

console.log(verifySign(JSON.stringify(data), publicKey, signature));
