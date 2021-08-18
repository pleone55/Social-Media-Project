const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

class Comments {
    constructor(comment, post, user, id) {
        this.comment = comment;
        this.post = post;
        this.user = user;
        this.ts = moment(new Date()).format('MMM Do YYYY, h:mm:ss a');
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('comments').insertOne(this);
    }

    static getPostsComments(postId) {
        const db = getDb();
        return db
            .collection('comments')
            .find({ "post.postId": postId })
            .toArray()
            .then(comments => {
                return comments
            })
            .catch(err => console.log(err));
    }

    static findById(commentId) {
        const db = getDb();
        return db
            .collection('comments')
            .find({ _id: new mongodb.ObjectId(commentId) })
            .next()
            .then(comment => {
                return comment;
            })
            .catch(err => console.log(err));
    }

    static findOne(userId) {
        const db = getDb();
        return db
            .collection('comments')
            .findOne({ "user.userId": userId })
            .toArray()
            .then(userComments => {
                return userComments;
            })
            .catch(err => console.log(err));
    }

    static deleteById(commentId) {
        const db = getDb();
        return db
            .collection('comments')
            .deleteOne({ _id: new mongodb.ObjectId(commentId) })
            .then(() => {
                console.log('Deleted comment with id: ', commentId);
            })
            .catch(err => console.log(err));
    }
}

module.exports = Comments;