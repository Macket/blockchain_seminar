const redisUtils = require('./redisUtils.js');

redisUtils.redisSet(0, {'sadas': 21412});

let _res = null;

const foo = async () => {
    _res = await redisUtils.redisMulti('tx_*');
    console.log(_res);
};

foo();
// console.log(redisUtils.redisGet(0, (res) => console.log(res)));