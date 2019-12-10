const axios = require("axios");
const TX = require('./transactionBuilder.js');
const { genKeys } = require('./cryptoUtils.js');
const { redisSet } = require('./redisUtils');

exports.createGenesisTx = (peers) => {
    console.log(peers);
    const { publicKey } = genKeys();

    const output1 = TX.createOutput(100, publicKey);
    const output2 = TX.createOutput(150, publicKey);
    const output3 = TX.createOutput(20, publicKey);
    const genesisTx = TX.createTx([], [output1, output2, output3], []);

    redisSet(`tx_${genesisTx.id}`, genesisTx);

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
