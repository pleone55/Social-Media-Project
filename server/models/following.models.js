const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

class Following {
    constructor(userId, following, id) {
        this.userId = userId;
        this.following = following; // { items: [] }
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('following').insertOne(this);
    }

    updateFollowing(user) {
        const updatedFollowingItem = [...this.following.items];

        updatedFollowingItem.push({
            userId: new mongodb.ObjectId(user._id),
            username: user.username
        });

        const updatedFollowing = {
            items: updatedFollowingItem
        };

        const db = getDb()
        return db
            .collection('following')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { following: updatedFollowing } }
            );
    }

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
            .findOne({ userId: userId })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Following;