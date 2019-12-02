`use strict`;
const http = require(`http`);

var kPort = 3000;
var local_ip = '127.0.0.1';


http.get(`http://${local_ip}:${kPort}/peers?address=${local_ip}:3001`, (resp) => {
  let data = ``;
  resp.on(`data`, (chunk) => {/* received part of response */ data += chunk});
  resp.on(`end`, () => {/* received full response */ console.log(`data: [${data}]\n`)})
}).on(`error`, (err) => {
  console.log(`error: [${err.message}]\n`)
});
