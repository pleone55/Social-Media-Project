const Following = require('../models/following.models');
const Followers = require('../models/followers.models');
const User = require('../models/user.models');
const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

exports.postFollowUser = (req, res, next) => {
    let userId = req.params.userId;
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
                        userId = new mongodb.ObjectId(userId);
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
                    res.redirect(`/user/${userId}`);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

const updateFollowers = (req, res, next) => {
    let userId = req.body.userId;
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
                                    return req.follower.updateFollowers(req.user);
                                })
                                .catch(err => console.log(err));
                        }
                    } else {
                        userId = new mongodb.ObjectId(req.user._id);
                        const username = req.user.username;
                        const followers = new Followers(
                            new mongodb.ObjectId(req.body.userId),
                            {
                                items: [{
                                    userId,
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
};

exports.unfollowUser = (req, res, next) => {
    const userToUnfollow = req.body.userId;
    const userId = req.user._id;
    let followingUserId;
    User.findById(userId)
        .then(user => {
            user.following.items.map(item => {
                followingUserId = item.userId;
            });
            if(userToUnfollow.toString() === followingUserId.toString()) {
                Following.findOne(userId)
                    .then(following => {
                        if(following) {
                            if(following.following.items.length > 0) {
                                req.following = new Following(
                                    following.userId,
                                    following.following,
                                    following._id
                                );
                                req.following.unfollowingUser(userToUnfollow)
                                    .then(() => {
                                        req.user.unfollowingUser(userToUnfollow);
                                        removeFollowers(req, res, next);
                                        console.log("Unfollowed user ", userToUnfollow);
                                    })
                                    .catch(err => console.log(err));
                            }
                        }
                    })
                    .catch(err => console.log(err));
            }    
        })
        .catch(err => console.log(err));
};

const removeFollowers = (req, res, next) => {
    const usertoRemoveFromFollowers = req.user._id;
    const userToRemoveFollowersFrom = req.body.userId;
    let followerUserId;
    User.findById(userToRemoveFollowersFrom)
        .then(user => {
            user.followers.items.map(item => {
                followerUserId = item.userId
            });
            if(followerUserId.toString() === usertoRemoveFromFollowers.toString()) {
                Followers.findOne(user._id)
                    .then(followerObj => {
                        if(followerObj) {
                            if(followerObj.followers.items.length > 0) {
                                Followers.findById(followerObj._id)
                                    .then(follower => {
                                        req.follower = new Followers(
                                                follower.userId,
                                                follower.followers,
                                                follower._id
                                            );
                                            next();
                                            req.follower.unfollowedUser(usertoRemoveFromFollowers)
                                    })
                                    .catch(err => console.log(err));
                            }
                        }
                    })
                    .catch(err => console.log(err));
                const updatedFollowerItems = user.followers.items.filter(item => {
                    return item.userId.toString() !== usertoRemoveFromFollowers.toString();
                });

                const db = getDb();
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new mongodb.ObjectId(user._id) },
                        { $set: { followers: { items: updatedFollowerItems } } }
                    )
                    .then(() => {
                        deleteFollowingDocument(req, res, next);
                        deleteFollowerDocument(req, res, next);
                        res.redirect(`/user/${userToRemoveFollowersFrom}`);
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};

const deleteFollowingDocument = (req, res, next) => {
    const userId = req.user._id;
    User.findById(userId)
        .then(user => {
            Following.findOne(user._id)
                .then(followingObj => {
                    if(followingObj) {
                        if(followingObj.following.items.length == 0) {
                            Following.deleteById(followingObj._id)
                                .then(() => {
                                    console.log('Following Document deleted');
                                })
                                .catch(err => {
                                    console.log(`Could not delete Following document with id ${following._id}`);
                                });
                        }
                    }
                })
        })
};

const deleteFollowerDocument = (req, res, next) => {
    const userId = new mongodb.ObjectId(req.body.userId);
    User.findById(userId)
        .then(user => {
            Followers.findOne(user._id)
                .then(followerObj => {
                    if(followerObj) {
                        if(followerObj.followers.items.length == 0) {
                            Followers.deleteById(followerObj._id)
                                .then(() => {
                                    console.log('Followers Document Deleted');
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};