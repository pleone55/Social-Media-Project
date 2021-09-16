const mongodb = require('mongodb');
const config = require('config');
const MongoClient = mongodb.MongoClient;

//socket.io connection
// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require('socket.io');
// const io = new Server(server);

// io.on('connection', socket => {
//     console.log('socket.io: User connected: ', socket.id);

//     socket.on('disconnected', () => {
//         console.log('socket.io: User disconnected: ', socket.id);
//     });
// });

// console.log('Setting change streams');
// const postsChangeStream = _db.collection('posts').watch();
// postsChangeStream.on('change', change => {
//     switch(change.operationType) {
//         case 'insert':
//             const post = {
//                 _id: change.fullDocument._id,
//                 post: change.fullDocument.post,
//                 user: {
//                     userId: change.fullDocument.userId,
//                     username: change.fullDocument.username,
//                     name: {
//                         firstName: change.fullDocument.firstName,
//                         lastName: change.fullDocument.lastName
//                     }
//                 },
//                 ts: change.fullDocument.ts
//             };

//             io.of('/api/socket').emit('newPost', post);
//             break;
//         case 'delete':
//             io.of('/api/socket').emit('deletedPost', change.documentKey._id);
//             break;
//     }
// });

let _db;
const MONGODB_URI = config.get("MongoClient");

const mongoConnect = callback => {
    MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
        .then(client => {
            console.log("Now connected to the database...");
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;