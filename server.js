`use strict`;
const http = require(`http`);
const express = require('express');
const bodyParser = require('body-parser');
const { handleTx } = require('./transactionBuilder');
const { genKeys,  } = require('./utils.js');
const { redisGet, redisSet } = require('./redis_utils.js');
const { createGenesisTx } = require('./genesis');

const { privateKey, publicKey } = genKeys();

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;
console.log(process.env.HTTP_PORT);

let peers = [];

//create a new app
const app  = express();

//using the blody parser middleware
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

app.post("/transact", (req, res) => {
    const new_tx = JSON.parse(req.body.tx);
    if (redisGet(new_tx.id) === null) {
        redisSet(new_tx.id, new_tx);
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
    setTimeout(() => createGenesisTx(peers), 5000);
}
