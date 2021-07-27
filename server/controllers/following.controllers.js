const Following = require('../models/following.models');
const Followers = require('../models/followers.models');
const User = require('../models/user.models');
const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

exports.postFollowUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            const username = user.username;

            Following.findOne(req.user._id)
                .then(followObj => {
                    if(followObj) {
                        if(followObj.userId.toString() === req.user._id.toString()) {
                            Following.findById(followObj._id)
                                .then(following => {
                                    req.following = new Following(
                                        following.userId,
                                        following.following,
                                        following._id
                                    );
                                    console.log("Following: ", req.following);
                                    next();
                                    return req.following.updateFollowing(user);
                                })
                                .catch(err => console.log(err));
                        }
                    } else {
                        const following = new Following(
                            new mongodb.ObjectId(req.user._id),
                            {
                                items: [{
                                    userId,
                                    username
                                }]
                            }
                        );
                        following.save();
                    }
                    req.user.followUser(user);
                    updateFollowers(req, res, next);
                    res.redirect('/dashboard');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

const updateFollowers = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId)
        .then(user => {
            Followers.findOne(user._id)
                .then(followerObj => {
                    if(followerObj) {
                        if(followerObj.userId.toString() === userId.toString()) {
                            Followers.findById(followerObj._id)
                                .then(follower => {
                                    req.follower = new Followers(
                                        follower.userId,
                                        follower.followers,
                                        follower._id
                                    );
                                    next();
                                    return req.follower.updateFollowers(user);
                                })
                                .catch(err => console.log(err));
                        }
                    } else {
                        const user_Id = req.user._id;
                        const username = req.user.username;
                        const followers = new Followers(
                            new mongodb.ObjectId(userId),
                            {
                                items: [{
                                    user_Id,
                                    username
                                }]
                            }
                        );
                        followers.save();
                    }
                    const updatedFollowersItems = [...user.followers.items];

                    updatedFollowersItems.push({
                        userId: new mongodb.ObjectId(req.user._id),
                        username: req.user.username
                    });

                    const db = getDb();
                    return db
                        .collection('users')
                        .updateOne(
                            { _id: new mongodb.ObjectId(user._id) },
                            { $set: { followers: { items: updatedFollowersItems } } }
                        );
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getFollowing = (req, res, next) => {
    const userId = new mongodb.ObjectId(req.params.userId);
    Following.findOne(userId)
        .then(user => {
            if(user.userId.toString() === userId.toString()) {
                res.render('users/getFollowing', {
                    user: user.following.items,
                    path: '/user/:userId/following'
                });
            }
        })
        .catch(err => {
            res.status(400).json({ Error: "Could not load user's following list." });
            console.log(err);
        });
};

exports.getFollowers = (req, res, next) => {
    const userId = new mongodb.ObjectId(req.params.userId);
    Followers.findOne(userId)
        .then(user => {
            if(user.userId.toString() === userId.toString()) {
                res.render('users/getFollowers', {
                    user: user.followers.items,
                    path: '/user/:userId/followers'
                });
            }
        })
        .catch(err => {
            res.status(400).json({ Error: "Could not load user's followers list." });
            console.log(err);
        })
}