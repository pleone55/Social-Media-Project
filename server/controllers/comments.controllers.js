const Comment = require('../models/comments.models');
const Post = require('../models/posts.models');

// exports.getAllComments = (req, res, next) => {
//     Comment.getAll()
//         .then(comms => {
//             res.render('dashboard/dashboard', {
//                 comments: comms,
//                 pageTitle: 'Dashboard',
//                 path: '/dashboard'
//             });
//         })
//         .catch(err => console.log(err));
// };

exports.getCreateComment = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            res.render('comments/createComment', {
                postId: postId,
                path: '/comments/create-comment',
                editing: false
            });
        });
};

exports.postCreateComment = (req, res, next) => {
    const { commentDesc } = req.body;
    const comment = new Comment(
        commentDesc,
        req.params.postId,
        req.user._id
    );
    comment
        .save()
        .then(() => {
            Comment.findById(comment._id)
                .then(comment => {
                    Post.findById(req.params.postId)
                        .then(post => {
                            req.post = new Post(
                                post.description,
                                post.userId,
                                post.comments,
                                post._id
                            );
                            next();
                            return req.post.commentPost(comment);
                        })
                    return req.user.createComment(comment);
                })
                .catch(err => console.log(err));
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
};

exports.deleteComment = (req, res, next) => {
    const commentId = req.body.commentId;

    //Find the comment and the post it is associated to and remove from post
    Comment.findById(commentId)
        .then(comment => {
            Post.findById(comment.postId)
                .then(post => {
                    req.post = new Post(
                        post.description,
                        post.userId,
                        post.comments,
                        post._id
                    );
                    req.post.deleteComment(commentId)
                        .then(() => {
                            console.log('Comment removed from Post collection');
                            res.redirect(`/dashboard/get-post/${post._id}`);
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

    //Delete Comment document and comment from user collection
    Comment.deleteById(commentId)
        .then(() => {
            console.log('Comment Deleted');
            req.user
                .deleteComment(commentId)
                    .then(() => {
                        console.log('Comment removed from user');
                    })
                    .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};