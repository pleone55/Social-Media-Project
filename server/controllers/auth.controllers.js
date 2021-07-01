const bcrypt = require('bcryptjs');

const User = require('../models/user.models');

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
    User.findOne(email)
        .then(user => {
            //check if user exists from existing email or username
            if(user) {
                req.flash('error', 'E-mail already exists. Please use a different email.');
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User(
                        firstName,
                        lastName,
                        username,
                        email,
                        hashedPassword,
                        { items: [] },
                        { items: [] },
                        { items: [] },
                        { items: [] },
                        { items: [] }
                    );
                    return user.save();
                })
                .then(() => {
                    console.log(user);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};