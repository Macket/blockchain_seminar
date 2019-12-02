const redisUtils = require('./redis_utils.js');

redisUtils.redisSet(0, 1, 10);

redisUtils.redisGet(0, 1);