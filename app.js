const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'cbs';

// Create a new MongoClient
const client = new MongoClient(url, {
    "useNewUrlParser": true,
    "replicaSet": "jerry"
});