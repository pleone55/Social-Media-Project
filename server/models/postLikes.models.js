const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

class PostLikes {
    constructor(postId, user, id) {
        this.postId = postId;
        this.user = user;
        this.ts = moment(new Date()).format('MMM Do YYYY, hh:mm:ss a');
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('postLikes').insertOne(this);
    }

    static getAllLikes() {
        const db = getDb();
        return db
            .collection('postLikes')
            .find()
            .toArray()
            .then(likes => {
                return likes;
            })
            .catch(err => console.log(err));
    }

    static findAllPostLikes(postId) {
        const db = getDb();
        return db
            .collection('postLikes')
            .find({ postId: postId })
            .toArray()
            .then(likes => {
                return likes;
            })
            .catch(err => console.log(err));
    }

    static deleteById(likeId) {
        const db = getDb();
        return db
            .collection('postLikes')
            .deleteOne({ _id: new mongodb.ObjectId(likeId) })
            .then(() => {
                console.log('Unliked Post');
            })
            .catch(err => console.log(err));
    }

    static deleteMany(postId) {
        const db = getDb();
        return db
            .collection('postLikes')
            .deleteMany({ postId: postId })
            .then(() => {
                console.log(`Deleted all likes from post with postId ${postId}`);
            })
            .catch(err => console.log(err));
    }
}

module.exports = PostLikes;