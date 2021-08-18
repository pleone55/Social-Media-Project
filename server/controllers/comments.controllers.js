const Comment = require('../models/comments.models');
const Post = require('../models/posts.models');
const CommentLikes = require('../models/commentLikes.models');
const mongodb = require('mongodb');

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
    const { comment } = req.body;
    if(comment === "" || comment == null) {
        req.flash('error', 'Cannot comment a post with a blank description');
    } else {
        const postId = new mongodb.ObjectId(req.params.postId);
        Post.findById(postId)
            .then(postDesc => {
                const post = postDesc.post;
                const comments = new Comment(
                    comment,
                    {
                        postId: postId,
                        post: post
                    },
                    {
                        userId: req.user._id,
                        username: req.user.username,
                        name: {
                            firstName: req.user.name.firstName,
                            lastName: req.user.name.lastName
                        }
                    }
                );
                comments
                    .save()
                    .then(() => {
                        res.redirect(`/dashboard/get-post/${postId}`);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
};

exports.deleteComment = (req, res, next) => {
    let commentId = req.body.commentId;
    const userId = req.user._id;
    const postId = new mongodb.ObjectId(req.body.postId);
    Comment.getPostsComments(postId)
        .then(postComments => {
            const postCommentId = postComments.filter(item => {
                return item._id.toString() === commentId.toString();
            });
            if(postCommentId) {
                if(userId.toString() === postCommentId[0].user.userId.toString()) {
                    Comment.deleteById(commentId)
                        .then(() => {
                            console.log('Comment deleted');
                            commentId = new mongodb.ObjectId(commentId);
                            CommentLikes.findAllCommentLikes(commentId)
                                .then(likes => {
                                    if(likes.length > 0) {
                                        CommentLikes.deleteMany(commentId)
                                            .then(() => {
                                                console.log('Likes deleted');
                                                return res.status(204).redirect(`/dashboard/get-post/${req.body.postId}`);
                                            })
                                            .catch(err => console.log('Could not delete likes from comment'));
                                    } else {
                                        return res.status(204).redirect(`/dashboard/get-post/${req.body.postId}`);
                                    }
                                })
                                .catch(err => console.log('Could not retrieve comment likes'));
                        })
                        .catch(err => {
                            res.status(404).json({ Error: 'No comment with comment id exists' });
                            console.log(err);
                        });
                } else {
                    res.status(403).json({ Error: 'Not authorized to delete comment' });
                    req.flash('error', 'Not authorized to delete comment');
                }
            } else {
                req.flash('error', 'Could not retrieve comments from post');
            }
        })
        .catch(err => {
            res.status(400).json({ Error: 'Could not retrieve comments from post' });
            console.log(err);
        });
};