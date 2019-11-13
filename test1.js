const crypto = require('crypto');
const TX = require('./transactionBuilder.js');
const { genKeys,  } = require('./utils.js');

const { privateKey, publicKey } = genKeys();

console.log(privateKey, publicKey);

output1 = TX.createOutput(100, publicKey);
output2 = TX.createOutput(150, publicKey);
output3 = TX.createOutput(20, publicKey);
const tx1 = TX.createTx(1, [], [output1, output2, output3], []);

input1 = TX.createInput({txId: tx1['id'], outputId: tx1['outputs'][0]['id']});
input2 = TX.createInput({txId: tx1['id'], outputId: tx1['outputs'][1]['id']});
input3 = TX.createInput({txId: tx1['id'], outputId: tx1['outputs'][2]['id']});

output4 = TX.createOutput(270, publicKey);

inputlist = [input1, input2, input3];
outputlist = [output4];

const tx2 = TX.createTx(2, inputlist, outputlist, [privateKey, privateKey, privateKey]);
//tx2.inputs[0].signature = 'фигня';


tx2.inputs.forEach(input => {
    console.log(input);
});

tx2.outputs.forEach(output => {
    console.log(output);
});

console.log(TX.validateInput(tx2['inputs'][0], tx1['outputs'][0]));
console.log(TX.validateTx(tx2));
// console.log(TX.validateTx(transaction));