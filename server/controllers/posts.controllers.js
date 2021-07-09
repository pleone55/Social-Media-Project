const Post = require('../models/posts.models');

exports.getDashboard = (req, res, next) => {
    Post.getAll()
        .then(posts => {
            res.render('dashboard/dashboard', {
                posts: posts,
                pageTitle: 'Dashboard',
                path: '/dashboard'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCreatePost = (req, res, next) => {
    res.render('posts/createPost', {
        pageTitle: 'Create Post',
        path: '/dashboard/create-post',
        editing: false
    });
};

exports.postCreatePost = (req, res, next) => {
    const { description } = req.body;
    const post = new Post(
        description,
        req.user._id
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
            res.redirect('/dashboard');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            res.render('posts/getPost', {
                user: req.user,
                post: post,
                pageTitle: post.description,
                path: '/dashboard/get-post'
            })
        })
        .catch(err => console.log(err));
};

exports.deletePost = (req, res, next) => {
    const postId = req.body.postId;
    Post.deleteById(postId)
        .then(() => {
            console.log('Post deleted');
            req.user
            .deletePost(postId)
                .then(() => {
                    console.log('Post removed from user');
                    res.redirect('/dashboard');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};