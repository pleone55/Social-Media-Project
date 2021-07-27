const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

class Followers {
    constructor(userId, followers, id) {
        this.userId = userId;
        this.followers = followers // { items[] }
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('followers').insertOne(this);
    }

    updateFollowers(user) {
        const updatedFollowersItem = [...this.followers.items];

        updatedFollowersItem.push({
            userId: new mongodb.ObjectId(user._id),
            username: user.username
        });

        const updatedFollowers = {
            items: updatedFollowersItem
        };

        const db = getDb();
        return db
            .collection('followers')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { followers: updatedFollowers } }
            );
    }

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
            .findOne({ userId: userId })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Followers;