const bcrypt = require('bcryptjs');
const Following = require('../models/following.models');
const User = require('../models/user.models');
const Post = require('../models/posts.models');
const Followers = require('../models/followers.models');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const config = require('config');

const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

// exports.getLogin = (req, res, next) => {
//     let message = req.flash('error');
//     if(message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render('auth/login', {
//         path: '/login',
//         pageTitle: 'Login',
//         errorMessage: message
//     });
// };

// exports.getSignUp = (req, res, next) => {
//     let message = req.flash('error');
//     if(message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render('auth/signup', {
//         path: '/signup',
//         pageTitle: 'Signup',
//         errorMessage: message
//     });
// };

exports.postSignup = (req, res, next) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
    User.findOneEmail(email)
        .then(user => {
            //check if user exists from existing email or username
            if(user) {
                return res.status(400).json({ msg: `User with email ${email} already exists` });
                // req.flash('error', 'E-mail already exists. Please use a different email.');
                // return res.redirect('/signup');
            }
            User.findOneUsername(username)
                .then(userName => {
                    if(userName) {
                        return res.status(400).json({ msg: `User with username ${username} already exists.` });
                        // req.flash('error', 'Username already exists. Please use a different username.');
                        // return res.redirect('/signup');
                    }
                    if(password !== confirmPassword) {
                        req.flash('error', 'Passwords do not match.');
                    }
                    if(password.length < 6) {
                        return res.status(401).json({ msg: 'Password length must be greater than 6 characters' });
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
                            const payload = {
                                user: {
                                    id: user._id
                                }
                            };
                            const jwtSecret = config.get('jwtSecret');
                            jwt.sign(payload, jwtSecret, {
                                expiresIn: 360000
                            }, (err, token) => {
                                if(err) throw err;
                                res.json({ token });
                            });
                            user.save();
                        })
                        // .then(() => {
                        //     res.redirect('/login');
                        // });
                })
                .catch(err => {
                    console.log(err.message);
                    return res.status(500).send('Server Error');
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Server Error');
        });
};

exports.postLogin = (req, res, next) => {
    let { email, password } = req.body;
    email = email.toString();
    password = password.toString();
    User.findOneEmail(email)
        .then(user => {
            // Check if user email is valid
            if(!user) {
                res.status(404).json({  msg: 'User not found' });
            }
            //check if password matches
            bcrypt
                .compare(password, user.password)
                    .then(matches => {
                        if(matches) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            req.session.save(err => {
                                console.log(err);
                            });
                            const payload = {
                                user: {
                                    id: user._id
                                }
                            };
                            const jwtSecret = config.get('jwtSecret');
                            jwt.sign(payload, jwtSecret, {
                                expiresIn: 360000
                            }, (err, token) => {
                                if(err) throw err;
                                res.json({ token });
                            });
                        } else {
                            return res.status(400).json({ msg: 'Invalid credentials' });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({ msg: 'Invalid email or password.' });
                    });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.status(201).end();
    });
};

exports.getUserById = (req, res, next) => {
    User.findById(req.user.id)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            res.status(404).json({ msg: 'Could not retrieve user' });
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
    const { userId } = req.params;
    User.findById(userId)
        .then(user => {
            Post.getAllPostsFromUser(user._id)
                .then(posts => {
                    Following.findAllFollowing(user._id)
                        .then(following => {
                            Followers.findAllFollowers(user._id)
                                .then(followers => {
                                    let redisObj = {
                                        following: following.length,
                                        followers: followers.length,
                                        posts: posts
                                    };
                                    let key = `${user.username}_info`;
                                    client.setex(key, 15, JSON.stringify(redisObj));
                                    res.render('users/getUser', {
                                        user: user,
                                        posts: posts,
                                        following: following.length,
                                        followers: followers.length,
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