const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

class Posts {
    constructor(post, user, id) {
        this.post = post;
        this.user = user;
        // this.comments = comments;
        this.ts = moment(new Date()).format('MMM Do YYYY, h:mm:ss a');
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('posts').insertOne(this);
    }

    // commentPost(comment) {
    //     const updatedPostCommentsItems = [...this.comments.items];

    //     updatedPostCommentsItems.push({
    //         commentId: new mongodb.ObjectId(comment._id),
    //         userId: comment.userId,
    //         comment: comment.commentDesc,
    //         ts: comment.ts
    //     });

    //     const updatedComments = {
    //         items: updatedPostCommentsItems
    //     };

    //     const db = getDb();
    //     return db
    //         .collection('posts')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { comments: updatedComments } }
    //         );
    // }

    // deleteComment(commentId) {
    //     const updatedCommentItems = this.comments.items.filter(item => {
    //         return item.commentId.toString() !== commentId.toString();
    //     });

    //     const db = getDb();
    //     return db
    //         .collection('posts')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { comments: { items: updatedCommentItems } } }
    //         );
    // }

    // static getAllPosts(user) {
    //     var followingUsers = user.following.items.map(item => {
    //         return item.userId
    //     });
    //     const db = getDb();
    //     return db
    //         .collection('posts')
    //         .find({ userId: { $in: followingUsers }})
    //         .toArray()
    //         .then(posts => {
    //             return posts;
    //         })
    //         .catch(err => console.log(err));
    // }

    static getAllPostsFromUser(userId, followingUserId) {
        const db = getDb();
        return db
            .collection('posts')
            .find({ $or: [{"user.userId": userId}, {"user.userId": followingUserId}] })
            .toArray()
            .then(posts => {
                // console.log(posts);
                return posts;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static getUserPosts(userId) {
        const db = getDb();
        return db
            .collection('posts')
            .find({ "user.userId": userId })
            .toArray()
            .then(posts => {
                return posts;
            })
            .catch(err => {
                console.log(err);
            });
    }

    // const key = `${userId}_posts`;
    // client.get(key, (err, data) => {
    //     if(err) throw err;
    //     else if(data) {
    //         return JSON.parse(data);
    //     } else {
    //         const db = getDb();
    //         return db
    //             .collection('posts')
    //             .find({ "user.userId": userId })
    //             .toArray()
    //             .then(posts => {
    //                 client.setex(key, 60, JSON.stringify(posts));
    //                 return posts;
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     }
    // })

    static findById(postId) {
        const db = getDb();
        return db
            .collection('posts')
            .find({ _id: new mongodb.ObjectId(postId) })
            .next()
            .then(post => {
                return post;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findOne(userId) {
        const db = getDb();
        return db
            .collection('posts')
            .findOne({ "user.userId": userId})
            .then(userPosts => {
                return userPosts;
            })
            .catch(err => console.log(err));
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