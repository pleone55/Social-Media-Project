const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(name, username, email, password, id) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        // this.posts = posts;         // {items: []}
        // this.comments = comments;   // {items: []}
        // this.followers = followers; // {items: []}
        // this.following = following; // {items: []}
        // this.likes = likes;         // {items: []}
        this.ts = moment(new Date()).format('MMM Do YYYY, h:mm:ss a');
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    
    // createPost(post) {
    //     const updatedPostItems = [...this.posts.items];

    //     updatedPostItems.push({
    //         postId: new ObjectId(post._id),
    //         post: post.post,
    //         ts: post.ts
    //     });
    //     // }
    //     const updatedPosts = {
    //         items: updatedPostItems
    //     };
    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new ObjectId(this._id) },
    //             { $set: { posts: updatedPosts } }
    //         );
    // }

    // createComment(comment) {
    //     const updatedCommentItem = [...this.comments.items];

    //     updatedCommentItem.push({
    //         commentId: new ObjectId(comment._id),
    //         comment: comment.commentDesc,
    //         ts: comment.ts
    //     });

    //     const updatedComments = {
    //         items: updatedCommentItem
    //     };

    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new ObjectId(this._id) },
    //             { $set: { comments: updatedComments } }
    //         );
    // }

    // followUser(user) {
    //     const updatedFollowingItem = [...this.following.items];

    //     updatedFollowingItem.push({
    //         userId: new ObjectId(user._id),
    //         username: user.username
    //     });

    //     const updatedFollowing = {
    //         items: updatedFollowingItem
    //     };

    //     const db = getDb()
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new ObjectId(this._id) },
    //             { $set: { following: updatedFollowing } }
    //         );
    // }

    // unfollowingUser(userId) {
    //     const updatedFollowingItems = this.following.items.filter(item => {
    //         return item.userId.toString() !== userId.toString();
    //     });

    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { following: { items: updatedFollowingItems} } }
    //         );
    // }

    // unfollowedUser(userId) {
    //     const updatedFollowerItems = this.followers.items.filter(item => {
    //         return item.userId.toString() !== userId.toString();
    //     });

    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { followers: { items: updatedFollowerItems} } }
    //         );
    // }

    // deletePost(postId) {
    //     const updatedPostItems = this.posts.items.filter(item => {
    //         return item.postId.toString() !== postId.toString();
    //     });
    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new ObjectId(this._id) },
    //             { $set: { posts: { items: updatedPostItems } } }
    //         );
    // }

    // deleteComment(commentId) {
    //     const updatedCommentItems = this.comments.items.filter(item => {
    //         return item.commentId.toString() !== commentId.toString();
    //     });

    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new ObjectId(this._id) },
    //             { $set: { comments: { items: updatedCommentItems } } }
    //         );
    // }

    static find(user) {
        const db = getDb();
        return db
            .collection('users')
            .find({ "name.lastName": { $regex: new RegExp(user) } })
            .toArray()
            .then(users => {
                return users;
            })
            .catch(err => console.log(err));
    }

    static findOneEmail(email) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ email: email })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findOneUsername(username) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ username: username })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                // console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;