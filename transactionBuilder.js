const sha256 = require('crypto-js/sha256');
const { createSign, verifySign } = require('./utils.js');

const target = 1000;
const TRANSACTIONS = {};

class OutputKey {
    constructor(txId, outputId) {
        this.txId = txId;
        this.outputId = outputId;
    }
}

exports.createInput = (_outputKey) => {
    var input = {
        id : -1,
        type : "input",
        outputKey : _outputKey // {txId: 1, outputId: 2},
    };

    return input;
};

exports.createOutput = (_amount, _publicKey) => {
    var output = {
        id : -1,
        type : "output",
        amount : _amount,
        pubKey : _publicKey
    };
    return output;
};

function randomId(){
    a = Math.random();
    return myHash(a.toString());
}

function myHash(_value){
    return Math.round(parseInt(sha256(_value),16)/Math.pow(10, 70))
}

exports.createTx = (_id, _inputs, _outputs, _privateKeys) => {
    var transaction = {
        id: _id,
        nonce: 0,
        inputs: [],
        outputs: []
    };
    _inputs.forEach((input, idx) => {
        addInput(transaction, input, _privateKeys[idx])
    });
    _outputs.forEach(output => {
        addOutput(transaction, output)
    });

    while (myHash(JSON.stringify(transaction)) >= target) {
        transaction.nonce += 1;
    }
    console.log(myHash(JSON.stringify(transaction)));
    console.log(transaction.nonce);

    TRANSACTIONS[transaction['id']] = transaction;
    console.log(TRANSACTIONS);
    return transaction;
};

function addInput(_tx, _input, _privateKey){
    _input['id'] = _tx.inputs.length;
    _input['signature'] =  createSign(JSON.stringify(_input), _privateKey);
    _tx.inputs.push(_input);
}

function addOutput(_tx, _output){
    _output['id'] = _tx.outputs.length; // index in array outputs in transaction
    _tx.outputs.push(_output);
}

exports.validateInput = (input, output) => {
    const inputCopy = {...input};
    delete inputCopy['signature'];
    if (!verifySign(JSON.stringify(inputCopy), output['pubKey'], input['signature'])) {
        return false
    }
    if (input['outputKey']['outputId'] !== output['id']) {
        return false
    }
    return true
};

exports.validateTx = (tx) => {
    if (myHash(JSON.stringify(tx)) >= target) {
        return false
    }

    let output_sum = 0;
    let input_sum = 0;
    tx.inputs.forEach(input => {
        const output_tx_index = input.outputKey.outputId;
        const output = TRANSACTIONS[input['outputKey']['txId']].outputs[output_tx_index];
        input_sum += output.amount;

        const inputCopy = {...input};
        delete inputCopy['signature'];
        if (verifySign(JSON.stringify(inputCopy), output.pubKey, input['signature'])) {
            return false;
        }
    });

    tx.outputs.forEach(output =>{
        output_sum += output.amount;
    });

    return output_sum <= input_sum;
};