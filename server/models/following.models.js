const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

class Following {
    constructor(user, followingUser, id) {
        this.user = user;
        this.followingUser = followingUser; // { items: [] }
        this.ts = moment(new Date()).format('MMM Do YYYY, h:mm:ss a');
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('following').insertOne(this);
    }

    // updateFollowing(user) {
    //     const updatedFollowingItem = [...this.following.items];

    //     updatedFollowingItem.push({
    //         userId: new mongodb.ObjectId(user._id),
    //         username: user.username
    //     });

    //     const updatedFollowing = {
    //         items: updatedFollowingItem
    //     };

    //     const db = getDb()
    //     return db
    //         .collection('following')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { following: updatedFollowing } }
    //         );
    // }

    
    // unfollowingUser(userId) {
    //     const updatedFollowingItems = this.following.items.filter(item => {
    //         return item.userId.toString() !== userId.toString();
    //     });

    //     const db = getDb();
    //     return db
    //         .collection('following')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { following: { items: updatedFollowingItems } } }
    //         );
    // }

    static findById(followingId) {
        const db = getDb();
        return db
            .collection('following')
            .findOne({ _id: new mongodb.ObjectId(followingId) })
            .then(following => {
                return following;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findOne(userId) {
        const db = getDb();
        return db
            .collection('following')
            .findOne({ "user.userId": userId })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static findAllFollowing(userId) {
        const db = getDb();
        return db
            .collection('following')
            .find({ "user.userId": userId })
            .toArray()
            .then(followingDocs => {
                return followingDocs;
            })
            .catch(err => console.log(err));
    }

    static deleteById(followingId) {
        const db = getDb();
        return db
            .collection('following')
            .deleteOne({ _id: new mongodb.ObjectId(followingId) })
            .then(() => {
                console.log('Document deleted with id ', followingId);
            })
            .catch(err => console.log(err));
    }
}

module.exports = Following;