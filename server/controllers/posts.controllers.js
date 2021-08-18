const Post = require('../models/posts.models');
const User = require('../models/user.models');
const Comment = require('../models/comments.models');
const mongodb = require('mongodb');
const Following = require('../models/following.models');
const PostLikes = require('../models/postLikes.models');

exports.getDashboard = (req, res, next) => {
    const userId = req.user._id;
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    PostLikes.getAllLikes()
        .then(likes => {
            Following.findAllFollowing(userId)
                .then(followingDocs => {
                    if(followingDocs.length == 0) {
                        Post.getAllPostsFromUser(userId)
                            .then(posts => {
                                // let likedPosts = likes.filter(item => {
                                //     return posts[0].filter(post => item.postId.toString() === post._id.toString())
                                // });
                                res.render('dashboard/dashboard', {
                                    posts: posts,
                                    likes: likedPosts.length,
                                    pageTitle: 'Dashboard',
                                    path: '/dashboard',
                                    errorMessage: message
                                });
                            })
                            .catch(err => console.log(err));
                    } else {
                        Following.findAllFollowing(userId)
                            .then(followingDocs => Promise.all(followingDocs.map(item => Post.getAllPostsFromUser(userId, item.followingUser.followingUserId))))
                            .then(posts => {
                                // let likedPosts = likes.filter(item => {
                                //     return posts[0].filter(post => item.postId.toString() === post._id.toString())
                                // });
                                res.render('dashboard/dashboard', {
                                    posts: posts[0],
                                    pageTitle: 'Dashboard',
                                    path: '/dashboard',
                                    errorMessage: message
                                });
                            })
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getCreatePost = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('posts/createPost', {
        pageTitle: 'Create Post',
        path: '/dashboard/create-post',
        editing: false,
        errorMessage: message
    });
};

exports.postCreatePost = (req, res, next) => {
    const { post } = req.body;
    if(post == "" || post == null) {
        req.flash('error', 'Cannot upload a blank post');
        res.redirect('/dashboard/create-post');
    } else {
        const posts = new Post(
            post,
            {
                userId: req.user._id,
                username: req.user.username,
                name: {
                    firstName: req.user.name.firstName,
                    lastName: req.user.name.lastName
                }
            }
        );
        posts
            .save()
            .then(result => {
                res.status(201);
                res.redirect('/dashboard');
            })
            .catch(err => {
                console.log(err);
            });
    }

};

exports.getPost = (req, res, next) => {
    const postId = new mongodb.ObjectId(req.params.postId);
    Post.findById(postId)
        .then(post => {
            const userPost = post.user.userId;
            User.findById(userPost)
                .then(user => {
                    Comment.getPostsComments(postId)
                        .then(comments => {
                            res.render('posts/getPost', {
                                user: user,
                                post: post,
                                comments: comments,
                                path: '/dashboard/get-post'
                            });
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.deletePost = (req, res, next) => {
    let postId = req.body.postId;
    const userId = req.user._id;
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
                            req.flash('Post deleted');
                            postId = new mongodb.ObjectId(postId);
                            PostLikes.findAllPostLikes(postId)
                                .then(likes => {
                                    if(likes.length > 0) {
                                        PostLikes.deleteMany(postId)
                                            .then(() => {
                                                console.log('Likes deleted');
                                                return res.redirect('/dashboard');
                                            })
                                            .catch(err => console.log(err));
                                    } else {
                                        return res.redirect('/dashboard');
                                    }
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                    } else {
                        console.log('Not Authorized to delete post');
                        req.flash('error', 'Not Authorized. Cannot delete.');
                        return res.redirect('/dashboard');
                    }
                } else {
                    res.status(404).json({ Error: 'Could not find post' });
                    return res.redirect('/dashboard');
                }
            } else {
                console.log('Not Authorized to delete post');
                req.flash('error', 'Not Authorized. Cannot delete.');
                return res.redirect('/dashboard');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ Error: `Could not find post belonging to user id ${user._id}` });
        });
};