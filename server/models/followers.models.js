const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;
const moment = require('moment');

class Followers {
    constructor(user, followerUser, id) {
        this.user = user;
        this.followerUser = followerUser;
        this.ts = moment(new Date()).format('MMM Do YYYY, h:mm:ss a');
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('followers').insertOne(this);
    }

    // updateFollowers(user) {
    //     const updatedFollowersItem = [...this.followers.items];

    //     updatedFollowersItem.push({
    //         userId: new mongodb.ObjectId(user._id),
    //         username: user.username
    //     });

    //     const updatedFollowers = {
    //         items: updatedFollowersItem
    //     };

    //     const db = getDb();
    //     return db
    //         .collection('followers')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { followers: updatedFollowers } }
    //         );
    // }

    // unfollowedUser(userId) {
    //     const updatedFollowerItems = this.followers.items.filter(item => {
    //         return item.userId.toString() !== userId.toString();
    //     });

    //     const db = getDb();
    //     return db
    //         .collection('followers')
    //         .updateOne(
    //             { _id: new mongodb.ObjectId(this._id) },
    //             { $set: { followers: { items: updatedFollowerItems} } }
    //         );
    // }

    static findById(followersId) {
        const db = getDb();
        return db
            .collection('followers')
            .findOne({ _id: new mongodb.ObjectId(followersId) })
            .then(follower => {
                return follower;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findOne(userId) {
        const db = getDb();
        return db
            .collection('followers')
            .findOne({ "user.userId": userId })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    static findAllFollowers(userId) {
        const db = getDb();
        return db
            .collection('followers')
            .find({ "user.userId": userId })
            .toArray()
            .then(followingDocs => {
                return followingDocs;
            })
            .catch(err => console.log(err));
    }

    static deleteById(followerId) {
        const db = getDb();
        return db
            .collection('followers')
            .deleteOne({ _id: new mongodb.ObjectId(followerId) })
            .then(() => {
                console.log('Document deleted with id ', followerId);
            })
            .catch(err => console.log(err));
    }
}

module.exports = Followers;