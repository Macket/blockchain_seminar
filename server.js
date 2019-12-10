`use strict`;
const http = require(`http`);
const express = require('express');
const bodyParser = require('body-parser');
const { validateTx } = require('./transactionBuilder');
const { genKeys,  } = require('./cryptoUtils.js');
const { redisGet, redisSet } = require('./redisUtils.js');
const { createGenesisTx } = require('./genesis');


const HTTP_PORT = process.env.HTTP_PORT || 3001;
const { publicKey, privateKey } = genKeys(String(HTTP_PORT));

let peers = [];

//create a new app and using the blody parser middleware
const app  = express();
app.use(bodyParser.json());

// ---------------------- API ----------------------

app.get('/handshake',(req,res)=>{
  if (peers.indexOf(req.query.address) >= 0) {
        res.json({ 'Error': 'You are already registered' });
        console.log('Already registered')
    } else {
        res.json({'peers': peers});
        peers.push(req.query.address);
    }
    console.log(peers)
});

app.post("/transact", async (req, res) => {
    const new_tx = JSON.parse(req.body.tx);
    const tx_from_pool = await redisGet(new_tx.id);
    if (tx_from_pool === null) {
        if (validateTx(new_tx)) {
            redisSet(new_tx.id, new_tx);
            res.json({ 'Response': 'OK' });
        } else {
            res.json({ 'Response': 'Invalid transaction' });
        }
    } else {
        res.json({ 'Response': 'Already exists' });
    }
});

// app server configurations
app.listen(HTTP_PORT,()=>{
    console.log(`listening on port ${HTTP_PORT}`);
});

// ---------------------- CONNECTION TO PEERS ----------------------

const connectionServerIp = '127.0.0.1';
const connectionServerPort = 3000;

http.get(`http://${connectionServerIp}:${connectionServerPort}/peers?address=127.0.0.1:${HTTP_PORT}`, (resp) => {
  let data = ``;
  resp.on(`data`, (chunk) => {/* received part of response */ data += chunk});
  resp.on(`end`, () => {
      /* received full response */
      peers = JSON.parse(data).peers;
      peers.forEach(peer => {
         http.get(`http://${peer}/handshake?address=127.0.0.1:${HTTP_PORT}`, (resp) => {
             let data = ``;
             resp.on(`data`, (chunk) => {/* received part of response */ data += chunk});
             resp.on(`end`, () => {/* received full response */ console.log(data)});
         }).on(`error`, (err) => {
             console.log(`error: [${err.message}]\n`)
        });
      });
  });
}).on(`error`, (err) => {
    console.log(`error: [${err.message}]\n`)
});

// ---------------------- INITIAL TRANSACTION ----------------------

if (HTTP_PORT === '3003') {
    setTimeout(() => createGenesisTx(peers), 2000);
}
