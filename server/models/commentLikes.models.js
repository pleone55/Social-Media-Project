const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

class CommentLikes {
    constructor(commentId, user, id) {
        this.commentId = commentId;
        this.user = user;
        this.ts = moment(new Date()).format('MMM Do YYYY, hh:mm:ss a');
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('commentLikes').insertOne(this);
    }

    static getAllLikes() {
        const db = getDb();
        return db
            .collection('commentLikes')
            .find()
            .toArray()
            .then(likes => {
                return likes;
            })
            .catch(err => console.log(err));
    }

    static findAllCommentLikes(commentId) {
        const db = getDb();
        return db
            .collection('commentLikes')
            .find({ commentId: commentId })
            .toArray()
            .then(likes => {
                return likes;
            })
            .catch(err => console.log(err));
    } 

    static deleteById(likeId) {
        const db = getDb();
        return db
            .collection('commentLikes')
            .deleteOne({ _id: new mongodb.ObjectId(likeId) })
            .then(() => {
                console.log('Unliked Comment');
            })
            .catch(err => console.log(err));
    }

    static deleteMany(commentId) {
        const db = getDb();
        return db
            .collection('commentLikes')
            .deleteMany({ commentId: commentId })
            .then(() => {
                console.log(`Deleted all likes from post with commentId ${commentId}`);
            })
            .catch(err => console.log(err));
    }
}

module.exports = CommentLikes;