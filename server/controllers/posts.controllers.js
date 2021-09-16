const Post = require('../models/posts.models');
const User = require('../models/user.models');
const Comment = require('../models/comments.models');
const mongodb = require('mongodb');
const Following = require('../models/following.models');
const PostLikes = require('../models/postLikes.models');

exports.getDashboard = (req, res, next) => {
    const userId =  new mongodb.ObjectId(req.user.id);
    PostLikes.getAllLikes()
        .then(likes => {
            Following.findAllFollowing(userId)
                .then(followingDocs => {
                    if(followingDocs.length == 0) {
                        Post.getUserPosts(userId)
                            .then(posts => {
                                // let likedPosts = likes.filter(item => {
                                //     return posts[0].filter(post => item.postId.toString() === post._id.toString())
                                // });
                                // res.render('dashboard/dashboard', {
                                //     posts: posts,
                                //     pageTitle: 'Dashboard',
                                //     path: '/dashboard',
                                //     errorMessage: message
                                // });
                                res.json(posts);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json({ msg: 'Could not load posts' });
                            });
                    } else {
                        Following.findAllFollowing(userId)
                            .then(followingDocs => Promise.all(followingDocs.map(item => Post.getAllPostsFromUser(userId, item.followingUser.followingUserId))))
                            .then(posts => {
                                // let likedPosts = likes.filter(item => {
                                //     return posts[0].filter(post => item.postId.toString() === post._id.toString())
                                // });
                                // res.render('dashboard/dashboard', {
                                //     posts: posts[0],
                                //     pageTitle: 'Dashboard',
                                //     path: '/dashboard',
                                //     errorMessage: message
                                // });
                                res.json(posts[0]);
                            })
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

// exports.getCreatePost = (req, res, next) => {
//     let message = req.flash('error');
//     if(message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render('posts/createPost', {
//         pageTitle: 'Create Post',
//         path: '/dashboard/create-post',
//         editing: false,
//         errorMessage: message
//     });
// };

exports.postCreatePost = (req, res, next) => {
    const { post } = req.body;
    if(post == "" || post == null) {
        res.status(400).json({ msg: 'Cannot leave fields empty' });
    } else {
        User.findById(req.user.id)
            .then(user => {
                const name = {
                    firstName: user.name.firstName,
                    lastName: user.name.lastName
                };
                const username = user.username;
                const id = user._id;
                const posts = new Post(
                    post,
                    {
                        userId: id,
                        username: username,
                        name: name
                    }
                );
                posts.save();
                return res.json(posts);
            })
            .catch(err => res.status(404).json({ msg: `Cannot find user with id ${req.user.id}` }));
    }
};

exports.getPost = (req, res, next) => {
    const postId = new mongodb.ObjectId(req.params.postId);
    Post.findById(postId)
        .then(post => {
            res.json(post);
            // console.log(post);
            // const userPost = post.user.userId;
            // User.findById(userPost)
            //     .then(user => {
            //         Comment.getPostsComments(postId)
            //             .then(comments => {
            //                 const getPost = {
            //                     user: user,
            //                     post: post,
            //                     comments: comments
            //                 };
            //                 res.json(post);
            //             })
            //             .catch(err => res.status(404).json({ msg: `Could not retrieve comments from post with post id ${postId}` }));
            //     })
            //     .catch(err => res.status(404).json({ msg: `Could not find user with user id ${userPost}` }));
        })
        .catch(err => res.status(404).json({ msg: `Could not find post with post id ${postId}` }));
};

exports.deletePost = (req, res, next) => {
    let postId = req.params.postId;
    const userId = mongodb.ObjectId(req.user.id);
    Post.getAllPostsFromUser(userId)
        .then(userPost => {
            if(userPost.length > 0) {
                const userPostId = userPost.filter(item => {
                    return item._id.toString() === postId.toString()
                });
                if(userPostId) {
                    if(userId.toString() === userPostId[0].user.userId.toString()) {
                        Post.deleteById(postId)
                        .then(() => {
                            console.log('Post deleted');
                            res.status(204);
                            postId = new mongodb.ObjectId(postId);
                            PostLikes.findAllPostLikes(postId)
                                .then(likes => {
                                    if(likes.length > 0) {
                                        PostLikes.deleteMany(postId)
                                            .then(() => {
                                                console.log('Likes deleted');
                                                return res.status(204).end();
                                            })
                                            .catch(err => res.status(404).json({ msg: `Could not delete likes for post with id ${postId}` }));
                                    } else {
                                        return;
                                    }
                                })
                                .catch(err => res.status(404).json({ msg: `Could not retrieve likes for post with id ${postId}` }));
                        })
                        .catch(err => res.status(404).json({ msg: `Could not delete post with id ${postId}` }));
                    } else {
                        console.log('Not Authorized to delete post');
                        return res.status(403).json({ msg: 'Not Authorized to delete post' });
                    }
                } else {
                    res.status(404).json({ msg: 'Could not find post' });
                }
            } else {
                console.log('Not Authorized to delete post');
                return res.status(403).json({ msg: 'Not Authorized to delete post' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ msg: `Could not find post belonging to user id ${user._id}` });
        });
};