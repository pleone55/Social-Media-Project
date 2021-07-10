const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

class Comments {
    constructor(commentDesc, postId, userId, id) {
        this.commentDesc = commentDesc;
        this.postId = postId;
        this.userId = userId;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('comments').insertOne(this);
    }

    static getAll() {
        const db = getDb();
        return db
            .collection('comments')
            .find()
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
                console.log(comment);
                return comment;
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