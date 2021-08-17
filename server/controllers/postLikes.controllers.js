const Post = require('../models/posts.models');
const PostLikes = require('../models/postLikes.models');
const User = require('../models/user.models');

exports.postPostLikes = (req, res, next) => {
    let { postId } = req.body;
    Post.findById(postId)
        .then(post => {
            postId = post._id;
            if(post._id.toString() === postId.toString()) {
                const { _id } = req.user;
                User.findById(_id)
                    .then(user => {
                        PostLikes.findAllPostLikes(postId)
                            .then(likes => {
                                const like = new PostLikes(
                                    postId,
                                    {
                                        userId: _id,
                                        name: {
                                            firstName: user.name.firstName,
                                            lastName: user.name.lastName
                                        },
                                        username: user.username
                                    }
                                );
                                const userLikedPost = likes.filter(item => postId.toString() === item.postId.toString() && _id.toString() === item.user.userId.toString());
                                if(likes.length == 0 || !userLikedPost) {
                                    like.save();
                                    res.redirect('/dashboard');
                                } else {
                                    const likeId = userLikedPost[0]._id;
                                    PostLikes.deleteById(likeId)
                                        .then(() => {
                                            console.log(`Unliked Post with postId ${postId}`);
                                            req.flash('success', `Unliked Post with postId ${postId}`);
                                            res.redirect('/dashboard');
                                        })
                                        .catch(err => console.log(err));
                                }
                            })
                    })
                    .catch(err => console.log(`Could not find user with id ${_id}`));
            }
        })
        .catch(err => console.log(err));
};