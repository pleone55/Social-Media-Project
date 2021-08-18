const Comment = require('../models/comments.models');
const CommentLikes = require('../models/commentLikes.models');
const User = require('../models/user.models');
const mongodb = require('mongodb');

exports.postCommentLikes = (req, res, next) => {
    let { commentId } = req.body;
    let { postId } = req.params;
    // CommentLikes.findAllCommentLikes(commentId)
    //     .then(likes => {
    //         console.log(likes);
    //     })
    //     .catch(err => console.log(err));
    Comment.findById(commentId)
        .then(comment => {
            commentId = comment._id;
            if(comment._id.toString() === commentId.toString()) {
                const { _id } = req.user;
                User.findById(_id)
                    .then(user => {
                        CommentLikes.findAllCommentLikes(commentId)
                            .then(likes => {
                                const like = new CommentLikes(
                                    commentId,
                                    {
                                        userId: _id,
                                        name: {
                                            firstName: user.name.firstName,
                                            lastName: user.name.lastName
                                        },
                                        username: user.username
                                    }
                                );
                                const userLikedComment = likes.filter(item => commentId.toString() === item.commentId.toString() && _id.toString() === item.user.userId.toString());
                                if(likes.length == 0 || !userLikedComment) {
                                    like.save();
                                    res.redirect(`/dashboard/get-post/${postId}`);
                                } else {
                                    const likeId = userLikedComment[0]._id;
                                    CommentLikes.deleteById(likeId)
                                        .then(() => {
                                            console.log(`Unliked Comment with commentId ${commentId}`);
                                            res.redirect(`/dashboard/get-post/${postId}`);
                                        })
                                        .catch(err => console.log(err));
                                }
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(`Cannot find user with id ${_id}`));
            }
        })
        .catch(err => console.log(`Cannot find Comment with commentId ${commentId}`));
};