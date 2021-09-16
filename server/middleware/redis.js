const redis = require('redis');
const getDb = require('../../util/database').getDb;

const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

client.on('connect', () => {
    console.log(`Connected to Redis on port ${REDIS_PORT}`);
});

module.exports = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const key = `${req.user.username}_info`;
    client.get(key, (err, data) => {
        if(err) throw err;
        if(data) {
            data = JSON.parse(data);
            res.render('users/getUser', {
                user: req.user,
                posts: data.posts,
                following: data.following,
                followers: data.followers,
                path: '/user',
                errorMessage: message
            });
        } else {
            next();
        }
    });
};
