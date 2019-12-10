// redisDemo.js
const redis = require('redis');
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
const client = redis.createClient(); // this creates a new client


client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

// client.hmset('my test key', 'input', 'inputt', 'output', 'outputt');
// client.HMSET('my test key 2', {
//     "0123456789": "abcdefghij", // NOTE: key and value will be coerced to strings
//     "some manner of key": "a type of value"
// });
client.select(1, function(err,res){
    if (err) {
        console.log(err);
        throw err;
    }
    let _res = null;
    const p = client.getAsync('0').then(function (result) {
        console.log('GET result ->' + result);
        _res = result
    });
    console.log();
});

//
// client.hgetall("my test key 2", function (err, obj) {
//     console.dir(obj);
// });


// const stream = redis.scanStream({ match: 'my test*' });
// console.log(stream);