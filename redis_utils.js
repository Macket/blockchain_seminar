const redis = require('redis');
const client = redis.createClient();

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const DB_IDX = HTTP_PORT - 3000;

console.log('DB_IDX', DB_IDX);

exports.redisSet = (key, value) => {
    client.select(DB_IDX, function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        client.set(key, JSON.stringify(value));
        console.log(JSON.stringify(value));
    });
};

exports.redisGet = (key) => {
    let res = null;
    client.select(DB_IDX, function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        client.get(key, function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            res = JSON.stringify(result);
        });
    });
    return res;
};
