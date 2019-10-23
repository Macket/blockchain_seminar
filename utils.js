const crypto = require('crypto');

exports.genKeys = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'sect239k1'
    });
    return { privateKey, publicKey }
};

exports.createSign = (data, privateKey) => {
    const sign = crypto.createSign('SHA256');
    sign.write(data);
    sign.end();
    return sign.sign(privateKey);
};

exports.verifySign = (data, publicKey, signature) => {
    const verify = crypto.createVerify('SHA256');
    verify.write(data);
    verify.end();
    return verify.verify(publicKey, signature);
};
