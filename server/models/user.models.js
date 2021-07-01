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
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;