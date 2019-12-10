const crypto = require('crypto');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const PASSPHRASE = HTTP_PORT.toString();

exports.genKeys = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: PASSPHRASE
        }
    });
    return { publicKey, privateKey }
};

exports.createSign = (data, privateKey) => {
    const sign = crypto.createSign('SHA256');
    sign.write(data);
    sign.end();
    return sign.sign({ key: privateKey, passphrase: PASSPHRASE }, 'hex');
};

exports.verifySign = (data, publicKey, signature) => {
    const verify = crypto.createVerify('SHA256');
    verify.write(data);
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
};
