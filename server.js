const express = require('express');
const bodyParser = require('body-parser');
const { handleTx } = require('./transactionBuilder');
const { genKeys,  } = require('./utils.js');

const { privateKey, publicKey } = genKeys();

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

console.log(process.env.HTTP_PORT);

//create a new app
const app  = express();

//using the blody parser middleware
app.use(bodyParser.json());

//EXPOSED APIs

//api to get the blocks
// app.get('/blocks',(req,res)=>{
//
//     res.json(blockchain.chain);
//
// });

//api to add blocks
// app.post('/mine',(req,res)=>{
//     const block = blockchain.addBlock(req.body.data);
//     console.log(`New block added: ${block.toString()}`);
//
//     res.redirect('/blocks');
//     p2pserver.syncChain();
// });

// api to view transaction in the transaction pool
app.get('/transactions',(req,res)=>{
  res.json({'status': 'ok'});
});

app.post("/transact", (req, res) => {
  const { inputs, outputs } = req.body;
  const privateKeys = [];
  inputs.forEach(() => privateKeys.push(privateKey));
  console.log(inputs);

  // handleTx(inputs, outputs, privateKeys);
  // const transaction = wallet.createTransaction(
  //    to, amount, type, blockchain, transactionPool
  // );
  // p2pserver.broadcastTransaction(transaction);
});

// app server configurations
app.listen(HTTP_PORT,()=>{
    console.log(`listening on port ${HTTP_PORT}`);
});

// p2pserver.listen(); // starts the p2pserver
// wallet.createTransaction(100, 1, 1, blockchain, transactionPool);
