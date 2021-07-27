const Comment = require('../models/comments.models');
const Post = require('../models/posts.models');
const User = require('../models/user.models');

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
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Post.findById(postId)
        .then(post => {
            res.render('comments/createComment', {
                postId: postId,
                path: '/comments/create-comment',
                editing: false,
                errorMessage: message
            });
        });
};

exports.postCreateComment = (req, res, next) => {
    const { commentDesc } = req.body;
    if(comment === "" || comment == null) {
        req.flash('error', 'Cannot comment a post with a blank description');
    } else {
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
    }
};

exports.deleteComment = (req, res, next) => {
    const commentId = req.body.commentId;
    const userId = req.user._id;
    let commentUserId;
    User.findById(userId)
        .then(user => {
            user.comments.items.map(c => {
                commentUserId = c.commentId;
            });
            if(commentUserId.toString() === commentId.toString()) {
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
            } else {
                req.flash('error', 'Not Authorized to delete comment');
                return res.redirect(`/dashboard/get-post/${req.params.postId}`)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ Error: `Could not find user with id ${userId}` });
        });
};