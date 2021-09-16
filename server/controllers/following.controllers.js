const Following = require('../models/following.models');
const Followers = require('../models/followers.models');
const User = require('../models/user.models');
const mongodb = require('mongodb');

exports.postFollowUser = (req, res, next) => {
    let userId = new mongodb.ObjectId(req.params.userId);
    User.findById(userId)
        .then(user => {
            Following.findOne(req.user._id)
                .then(f => {
                    const { name, username, _id } = user;
                    const following = new Following(
                        {
                            userId: req.user._id,
                            name: req.user.name,
                            username: req.user.username,
                        },
                        {
                            followingUserId: _id,
                            name: name,
                            username: username,
                        }
                    );
                    if(!f) {
                        following.save();
                        updateFollowers(req, res, next);
                        res.redirect(`/user/${userId}`);
                    } else {
                        if(userId.toString() === req.user._id.toString()) {
                            req.flash('error', 'Cannot follow yourself');
                            res.redirect(`/user/${userId}`);
                        } else if(f.followingUser.followingUserId.toString() === userId.toString()) {
                                req.flash('error', 'Already following user');
                                res.redirect(`/user/${userId}`);
                                res.status(400).end();
                        } else {
                            following.save();
                            updateFollowers(req, res, next);
                            res.redirect(`/user/${userId}`);
                        }
                    }
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
                .then(followerDoc => {
                    const { name, username, _id } = user;
                    const followers = new Followers(
                        {
                            userId: _id,
                            name: name,
                            username: username
                        },
                        {
                            followerUserId: req.user._id,
                            name: req.user.name,
                            username: req.user.username
                        }
                    );
                    if(!followerDoc) {
                        followers.save();
                    } else {
                        if(followerDoc.followerUser.followerUserId.toString() === req.user._id.toString()) {
                            req.flash('error', 'Already following user');
                            res.redirect(`/user/${userId}`);
                            res.status(400).end();
                        } else {
                            followers.save();
                        }
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getFollowing = (req, res, next) => {
    const userId = new mongodb.ObjectId(req.params.userId);
    Following.findAllFollowing(userId)
        .then(followingDocs => {
            res.render('users/getFollowing', {
                following: followingDocs,
                path: '/user/:userId/following'
            });
        })
        .catch(err => {
            res.status(400).json({ Error: "Could not load user's following list." });
            console.log(err);
        });
};

exports.getFollowers = (req, res, next) => {
    const userId = new mongodb.ObjectId(req.params.userId);
    Followers.findAllFollowers(userId)
        .then(followerDocs => {
            res.render('users/getFollowers', {
                followers: followerDocs,
                path: '/user/:userId/followers'
            });
        })
        .catch(err => {
            res.status(400).json({ Error: "Could not load user's followers list." });
            console.log(err);
        })
};

exports.unfollowUser = (req, res, next) => {
    const userToUnfollow = new mongodb.ObjectId(req.body.userId);
    const userId = req.user._id;
    Following.findOne(userId)
        .then(followingDoc => {
            if(followingDoc.user.userId.toString() === userId.toString()) {
                if(followingDoc.followingUser.followingUserId.toString() === userToUnfollow.toString()) {
                    Following.deleteById(followingDoc._id)
                        .then(() => {
                            console.log(`Unfollowed user ${userToUnfollow}`);
                            Followers.findOne(userToUnfollow)
                                .then(followerDoc => {
                                    if(followerDoc) {
                                        if(followerDoc.user.userId.toString() === userToUnfollow.toString()) {
                                            if(followerDoc.followerUser.followerUserId.toString() === userId.toString()) {
                                                Followers.deleteById(followerDoc._id)
                                                    .then(() => {
                                                        console.log(`User ${userToUnfollow} was unfollowed by ${userId}`);
                                                        res.redirect(`/user/${req.params.userId}`)
                                                    })
                                                    .catch(err => console.log(err));
                                            }
                                        }
                                    }
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                }
            }
        })
        .catch(err => console.log(err));
};

// const removeFollowers = (req, res, next) => {
//     const usertoRemoveFromFollowers = req.user._id;
//     const userToRemoveFollowersFrom = req.body.userId;
//     let followerUserId;
//     User.findById(userToRemoveFollowersFrom)
//         .then(user => {
//             user.followers.items.map(item => {
//                 followerUserId = item.userId
//             });
//             if(followerUserId.toString() === usertoRemoveFromFollowers.toString()) {
//                 Followers.findOne(user._id)
//                     .then(followerObj => {
//                         if(followerObj) {
//                             if(followerObj.followers.items.length > 0) {
//                                 Followers.findById(followerObj._id)
//                                     .then(follower => {
//                                         req.follower = new Followers(
//                                                 follower.userId,
//                                                 follower.followers,
//                                                 follower._id
//                                             );
//                                             next();
//                                             req.follower.unfollowedUser(usertoRemoveFromFollowers)
//                                     })
//                                     .catch(err => console.log(err));
//                             }
//                         }
//                     })
//                     .catch(err => console.log(err));
//                 const updatedFollowerItems = user.followers.items.filter(item => {
//                     return item.userId.toString() !== usertoRemoveFromFollowers.toString();
//                 });

//                 const db = getDb();
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: new mongodb.ObjectId(user._id) },
//                         { $set: { followers: { items: updatedFollowerItems } } }
//                     )
//                     .then(() => {
//                         deleteFollowingDocument(req, res, next);
//                         deleteFollowerDocument(req, res, next);
//                         res.redirect(`/user/${userToRemoveFollowersFrom}`);
//                     })
//                     .catch(err => console.log(err));
//             }
//         })
//         .catch(err => console.log(err));
// };

// const deleteFollowingDocument = (req, res, next) => {
//     const userId = req.user._id;
//     User.findById(userId)
//         .then(user => {
//             Following.findOne(user._id)
//                 .then(followingObj => {
//                     if(followingObj) {
//                         if(followingObj.following.items.length == 0) {
//                             Following.deleteById(followingObj._id)
//                                 .then(() => {
//                                     console.log('Following Document deleted');
//                                 })
//                                 .catch(err => {
//                                     console.log(`Could not delete Following document with id ${following._id}`);
//                                 });
//                         }
//                     }
//                 })
//         })
// };

// const deleteFollowerDocument = (req, res, next) => {
//     const userId = new mongodb.ObjectId(req.body.userId);
//     User.findById(userId)
//         .then(user => {
//             Followers.findOne(user._id)
//                 .then(followerObj => {
//                     if(followerObj) {
//                         if(followerObj.followers.items.length == 0) {
//                             Followers.deleteById(followerObj._id)
//                                 .then(() => {
//                                     console.log('Followers Document Deleted');
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                 });
//                         }
//                     }
//                 })
//                 .catch(err => console.log(err));
//         })
//         .catch(err => console.log(err));
// };