const redis = require('redis');
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

const client = redis.createClient();

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const DB_IDX = 3;

console.log('DB_IDX', DB_IDX);

exports.redisSet = (key, value) => {
    client.select(DB_IDX, function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        client.set(key, JSON.stringify(value));
    });
};

exports.redisGet = async (key) => {
    return await client.selectAsync(DB_IDX).then(async function (res) {
        return await client.getAsync(key).then(async function (result) {
            return await result;
        });
    });
};

exports.redisKeys = async (prefix) => {
    return await client.selectAsync(DB_IDX).then(async function (res) {
        return await client.keysAsync(prefix).then(async function (keys) {
            return await keys;
        });
    });
};
