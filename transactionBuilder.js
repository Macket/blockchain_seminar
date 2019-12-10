const sha256 = require('crypto-js/sha256');
const redis = require('redis');
const client = redis.createClient();
const { createSign, verifySign } = require('./cryptoUtils.js');
const { redisGet } = require('./redisUtils');


const target = 1000;

class OutputKey {
    constructor(txId, outputId) {
        this.txId = txId;
        this.outputId = outputId;
    }
}

exports.createInput = (_outputKey) => {
    return {
        id: -1,
        type: "input",
        outputKey: _outputKey // {txId: 1, outputId: 2},
    };
};

exports.createOutput = (_amount, _publicKey) => {
    return {
        id: -1,
        type: "output",
        amount: _amount,
        pubKey: _publicKey,
        is_spent: false
    };
};

function myHash(_value){
    return Math.round(parseInt(sha256(_value),16)/Math.pow(10, 70))
}

exports.createTx = (_inputs, _outputs, _privateKeys) => {
    var transaction = {
        inputs: [],
        outputs: [],
        timestamp: Date.now()
    };
    _inputs.forEach((input, idx) => {
        addInput(transaction, input, _privateKeys[idx])
    });
    _outputs.forEach(output => {
        addOutput(transaction, output)
    });

    transaction['id'] = myHash(JSON.stringify(transaction));

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
    tx.inputs.forEach(async input => {
        const outputTx = await redisGet(`tx_${input.outputKey.txId}`);
        if (!outputTx) {
            return false
        }

        const output = outputTx.outputs[input.outputKey.outputId];
        if (!output) {
            return false
        }

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


exports.handleTx = (_inputs, _outputs, _privateKeys) => {
    const tx = this.createTx(_inputs, _outputs, _privateKeys);
    if (this.validateTx(tx)) {
        console.log(tx);
        this.redisSet(tx.id, JSON.stringify(tx));
    }
};
