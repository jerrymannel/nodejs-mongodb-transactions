const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'cbs';

// Create a new MongoClient
const client = new MongoClient(url, {
    "useNewUrlParser": true,
    "replicaSet": "jerry"
});

var db = null,
    col = null;

// data
const users = [{
        _id: "U1001",
        name: "Alice"
    },
    {
        _id: "U1002",
        name: "Bob"
    },
    {
        _id: "U1003",
        name: "Charlie"
    },
    {
        _id: "U1004",
        name: "Dennis"
    }
];

const accounts = [{
        _id: "A1001",
        balance: 1000
    },
    {
        _id: "A1002",
        balance: 2000
    },
    {
        _id: "A1003",
        balance: 3000
    },
    {
        _id: "A1004",
        balance: 4000
    }
];

client.connect()
    .then(_ => db = client.db(dbName))
    .then(_ => console.log("Connected to mongoDB"))
    .then(_ => col = db.collection("users"))
    .then(_ => col.drop(null, () => {}))
    .then(_ => col.createIndex("name", {
        name: "UserNameIndex"
    }))
    .then(_ => col.insertMany(users))
    .then(_ => col.countDocuments({}))
    .then(_count => console.log(`Inserted ${_count} users`))
    .then(_ => col = db.collection("accounts"))
    .then(_ => col.drop(null, () => {}))
    .then(_ => col.insertMany(accounts))
    .then(_ => col.countDocuments({}))
    .then(_count => console.log(`Inserted ${_count} accounts`))
    .then(_ => client.close())
    .catch(_err => console.log(_err.message));