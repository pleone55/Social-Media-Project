const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

class Posts {
    constructor(description, userId, comments, id) {
        this.description = description;
        this.userId = userId;
        this.comments = comments;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('posts').insertOne(this);
    }

    commentPost(comment) {
        const updatedPostCommentsItems = [...this.comments.items];

        updatedPostCommentsItems.push({
            commentId: new mongodb.ObjectId(comment._id),
            comment: comment.commentDesc
        });

        const updatedComments = {
            items: updatedPostCommentsItems
        };

        const db = getDb();
        return db
            .collection('posts')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { comments: updatedComments } }
            );
    }

    deleteComment(commentId) {
        const updatedCommentItems = this.comments.items.filter(item => {
            return item.commentId.toString() !== commentId.toString();
        });

        const db = getDb();
        return db
            .collection('posts')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { comments: { items: updatedCommentItems } } }
            );
    }

    static getAll() {
        const db = getDb();
        return db
            .collection('posts')
            .find()
            .toArray()
            .then(posts => {
                // console.log(posts);
                return posts;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(postId) {
        const db = getDb();
        return db
            .collection('posts')
            .find({ _id: new mongodb.ObjectId(postId) })
            .next()
            .then(post => {
                console.log(post);
                return post;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteById(postId) {
        const db = getDb();
        return db
            .collection('posts')
            .deleteOne({ _id: new mongodb.ObjectId(postId) })
            .then(() => {
                console.log('Deleted post with id: ', postId);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Posts;