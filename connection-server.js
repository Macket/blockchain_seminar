const express = require('express');
const bodyParser = require('body-parser');

const HTTP_PORT = 3000;
const peers = [];

const app  = express();
app.use(bodyParser.json());

app.get('/peers',(req,res) => {
    if (peers.indexOf(req.query.address) >= 0) {
        res.json({ 'Error': 'You are already registered' });
        console.log('Already registered')
    } else {
        res.json({'peers': peers});
        peers.push(req.query.address);
    }
});

app.listen(HTTP_PORT,() => {
    console.log(`listening on port ${HTTP_PORT}`);
});
