const TX = require('./transactionBuilder.js');
const { genKeys,  } = require('./utils.js');
const { redisSet } = require('./redis_utils');
const axios = require("axios");

exports.createGenesisTx = (peers) => {
    const { privateKey, publicKey } = genKeys();

    output1 = TX.createOutput(100, publicKey);
    output2 = TX.createOutput(150, publicKey);
    output3 = TX.createOutput(20, publicKey);
    const genesisTx = TX.createTx([], [output1, output2, output3], []);

    redisSet(genesisTx.id, genesisTx);

    peers.forEach(peer => {
        axios.post(`http://${peer}/transact`, {
            tx: JSON.stringify(genesisTx),
        }).then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    });
};
