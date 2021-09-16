const express = require('express');
const cors = require('cors');
const mongoConnect = require('./util/database').mongoConnect;
const csrf = require('csurf');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');
const flash = require('connect-flash');
const hbs = require('express-handlebars');
const path = require('path');

const app = express();

const MONGODB_URI = config.get("MongoClient");
const User = require('./server/models/user.models');

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

//init middleware
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: config.get('secret'),
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
// app.use(csrf());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = new User(
                user.name,
                user.username, 
                user.email, 
                user.password, 
                user._id
            );
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/api', require('./server/routes/auth.routes'));
app.use(require('./server/routes/posts.routes'));
app.use(require('./server/routes/comments.routes'));
app.use(require('./server/routes/follow.routes'));
app.use(require('./server/routes/likes.routes'));

//Create port
const PORT = process.env.PORT || 7777;
// const REDIS_PORT = process.env.PORT || 6379;

mongoConnect(() => { 
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
});