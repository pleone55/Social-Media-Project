const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(firstName, lastName, username, email, password, posts, comments, followers, following, likes, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.posts = posts;         // {items: []}
        this.comments = comments;   // {items: []}
        this.followers = followers; // {items: []}
        this.following = following; // {items: []}
        this.likes = likes;         // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    
    createPost(post) {
        // const postIndex = this.posts.items.findIndex(p => {
        //     return p.postId.toString() === post._id.toString();
        // });
        // let newQuantity = 1;
        const updatedPostItems = [...this.posts.items];

        // if(postIndex >= 0) {
        //     newQuantity = this.posts.items[postIndex].quantity + 1;
        //     updatedPostItems[postIndex].quantity = newQuantity;
        // } else {
        updatedPostItems.push({
            postId: new ObjectId(post._id),
            description: post.description
        });
        // }
        const updatedPosts = {
            items: updatedPostItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { posts: updatedPosts } }
            );
    }

    createComment(comment) {
        const updatedCommentItem = [...this.comments.items];

        updatedCommentItem.push({
            commentId: new ObjectId(comment._id),
            comment: comment.commentDesc
        });

        const updatedComments = {
            items: updatedCommentItem
        };

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { comments: updatedComments } }
            );
    }

    followUser(user) {
        const updatedFollowingItem = [...this.following.items];

        updatedFollowingItem.push({
            userId: new ObjectId(user._id),
            username: user.username
        });

        const updatedFollowing = {
            items: updatedFollowingItem
        };

        const db = getDb()
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { following: updatedFollowing } }
            );
    }

    // userFollowed(user) {
    //     const updatedFollowersItem = [...this.followers.items];

    //     updatedFollowersItem.push({
    //         userId: new ObjectId(user._id),
    //         username: user.username
    //     });

    //     const updatedFollowers = {
    //         items: updatedFollowersItem
    //     };

    //     const db = getDb();
    //     return db
    //         .collection('users')
    //         .updateOne(
    //             { _id: new ObjectId(this._id) },
    //             { $set: updatedFollowers }
    //         );
    // }

    deletePost(postId) {
        const updatedPostItems = this.posts.items.filter(item => {
            return item.postId.toString() !== postId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { posts: { items: updatedPostItems } } }
            );
    }

    deleteComment(commentId) {
        const updatedCommentItems = this.comments.items.filter(item => {
            return item.commentId.toString() !== commentId.toString();
        });

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { comments: { items: updatedCommentItems } } }
            );
    }

    static find(user) {
        const db = getDb();
        return db
            .collection('users')
            .find({ lastName: { $regex: new RegExp(user) } })
            .toArray()
            .then(users => {
                return users;
            })
            .catch(err => console.log(err));
    }

    static findOne(email) {
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