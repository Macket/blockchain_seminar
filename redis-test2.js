let redis  = require("redis"),
    client = redis.createClient(), set_size = 20;

client.select(1, function (err, res) {
    // client.sadd("bigset", "a member");
    // client.sadd("bigset", "another member");
    //
    // while (set_size > 0) {
    //     client.sadd("bigset", "member " + set_size);
    //     set_size -= 1;
    // }

    // multi chain with an individual callback
    client.multi()
        .keys("tx_*", function (err, replies) {
            // NOTE: code in this callback is NOT atomic
            // this only happens after the the .exec call finishes.
            client.mget(replies, redis.print);
        })
        .exec(function (err, replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
        });
});