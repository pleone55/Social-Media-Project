const Post = require('../models/posts.models');
const User = require('../models/user.models');

exports.getDashboard = (req, res, next) => {
    const userId = req.user._id;
    let postUserId;
    let followingUserId;
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Post.getAllPostsFromUser(userId)
        .then(userPosts => {
            // Map through posts collection to grab the userId
            userPosts.map(p => {
                postUserId = p.userId;
            });
            User.findById(userId)
                .then(user => {
                    // If user does not have posts or following anyone render blank page
                    if(!postUserId) {
                        res.render('dashboard/dashboard', {
                            posts: null,
                            pageTitle: 'Dashboard',
                            path: '/dashboard',
                            errorMessage: message
                        });
                        res.status(200);
                    // If the user has posts but isnt following anyone
                    } else if(postUserId && user.following.items.length == 0) {
                        res.render('dashboard/dashboard', {
                            posts: userPosts,
                            pageTitle: 'Dashboard',
                            path: '/dashboard',
                            errorMessage: message
                        });
                        res.status(200);
                    } else if(postUserId && user.following.items.length > 0) {
                        Post.getAllPosts()
                            .then(posts => {
                                // Map through the users following document to grab the userId associate with the userId from posts collection
                                user.following.items.map(item => {
                                    posts = posts.filter(p => 
                                        p.userId.toString() === item.userId.toString() || 
                                        p.userId.toString() === userId.toString());
                                });
                                // Grab the users posts and their following posts
                                res.render('dashboard/dashboard', {
                                    posts: posts,
                                    pageTitle: 'Dashboard',
                                    path: '/dashboard',
                                    errorMessage: message
                                });
                                res.status(200);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json({ Error: 'Could not retrieve posts' });
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(404).json({ Error: `Could not find user with user id ${user._id}.` });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ Error: 'Could not load posts' });
        });
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
    const { description } = req.body;
    if(description == "" || description == null) {
        req.flash('error', 'Cannot upload a blank post');
        res.redirect('/dashboard/create-post');
    } else {
        const post = new Post(
            description,
            req.user._id,
            { items: [] }
        );
        post
            .save()
            .then(result => {
                Post.findById(post._id)
                    .then(post => {
                        return req.user.createPost(post);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                res.status(201);
                res.redirect('/dashboard');
            })
            .catch(err => {
                console.log(err);
            });
    }

};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            const userPost = post.userId;
            User.findById(userPost)
                .then(user => {
                    res.render('posts/getPost', {
                        user: user,
                        post: post,
                        pageTitle: post.description,
                        path: '/dashboard/get-post'
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.deletePost = (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.user._id;
    let postUserId;
    User.findById(userId)
        .then(user => {
            user.posts.items.map(p => {
                postUserId = p.postId;
            });
            if(postUserId.toString() === postId.toString()){
                Post.deleteById(postId)
                    .then(() => {
                        console.log('Post deleted');
                        req.flash('Post deleted');
                        req.user
                        .deletePost(postId)
                            .then(() => {
                                console.log('Post removed from user');
                                res.redirect('/dashboard');
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            } else {
                console.log('Not Authorized to delete post');
                req.flash('error', 'Not Authorized. Cannot delete.');
                return res.redirect('/dashboard');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ Error: `Could not find user with user id ${user._id}` });
        });
};