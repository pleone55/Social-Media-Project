const mongodb = require('mongodb');
const config = require('config');
const MongoClient = mongodb.MongoClient;

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