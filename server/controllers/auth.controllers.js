const bcrypt = require('bcryptjs');
const Following = require('../models/following.models');
const User = require('../models/user.models');
const Post = require('../models/posts.models');
const Followers = require('../models/followers.models');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignUp = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
    User.findOneEmail(email)
        .then(user => {
            //check if user exists from existing email or username
            if(user) {
                req.flash('error', 'E-mail already exists. Please use a different email.');
                return res.redirect('/signup');
            }
            User.findOneUsername(username)
                .then(userName => {
                    if(userName) {
                        req.flash('error', 'Username already exists. Please use a different username.');
                        return res.redirect('/signup');
                    }
                    if(password !== confirmPassword) {
                        req.flash('error', 'Passwords do not match.');
                        return res.redirect('/signup');
                    }
                    return bcrypt
                        .hash(password, 12)
                        .then(hashedPassword => {
                            const user = new User(
                                {
                                    firstName,
                                    lastName
                                },
                                username,
                                email,
                                hashedPassword,
                            );
                            return user.save();
                        })
                        .then(() => {
                            // console.log(user);
                            res.redirect('/login');
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOneEmail(email)
        .then(user => {
            //Check if user email is valid
            if(!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            //check if password matches
            bcrypt
                .compare(password, user.password)
                    .then(matches => {
                        if(matches) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                console.log(err);
                                res.redirect('/dashboard');
                            });
                        }
                        req.flash('error', 'Invalid email or password.');
                        res.redirect('/login');
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/login');
                    });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};

exports.searchUsers = (req, res, next) => {
    const { user } = req.query;
    User.find(user)
        .then(users => {
            res.render('dashboard/searchResults', {
                users: users,
                path: '/dashboard/search'
            });
        })
        .catch(err => console.log(err));
};

exports.getUser = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            Post.getAllPostsFromUser(user._id)
                .then(posts => {
                    Following.findAllFollowing(user._id)
                        .then(following => {
                            Followers.findAllFollowers(user._id)
                                .then(followers => {
                                    res.render('users/getUser', {
                                        user: user,
                                        posts: posts,
                                        following: following,
                                        followers: followers,
                                        path: '/user',
                                        errorMessage: message
                                    });
                                })
                                .catch(err => {
                                    res.status(400).json({ Error: 'Could not retrieve followers' });
                                })
                        })
                        .catch(err => {
                            req.flash('error', 'Could not retrieve following users');
                        });
                })
                .catch(err => {
                    req.flash('error', 'Could not retrieve posts');
                });
        })
        .catch(err => console.log(err));
};