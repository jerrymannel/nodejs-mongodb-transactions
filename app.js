const MongoClient = require('mongodb').MongoClient
const express = require('express')
const app = express()
const port = 8080

const initDB = require("./initDB")
const data = require("./data")
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'cbs'

// Create a new MongoClient
const client = new MongoClient(url, {
    "useNewUrlParser": true,
    "replicaSet": "jerry"
})

let db = null,
    session = null

async function init() {
    try {
        await client.connect()
        db = client.db(dbName)
        console.log("Connected to mongoDB")
        await initDB(client, db)
        session = client.startSession({
            defaultTransactionOptions: {
                readConcern: {
                    level: 'snapshot'
                },
                writeConcern: {
                    w: 'majority'
                },
                readPreference: 'primary'
            }
        })
    } catch (_err) {
        console.log(_err.message)
    }
}

app.use(express.json())

app.use((req, res, next) => {
    console.log("---------------------------------------------------------------------")
    next()
})

app.get('/', (_req, _res) => res.json({
    message: 'Hello World!'
}))

app.get('/userSet1', async(_req, _res) => {
    console.log("GET /users")
    let userCollection = db.collection("userSet1")
    let users = await userCollection.find({}).toArray()
    _res.json(users)
})

app.get('/userSet2', async(_req, _res) => {
    console.log("GET /users")
    let userCollection = db.collection("userSet2")
    let users = await userCollection.find({}).toArray()
    _res.json(users)
})

app.post('/userSet1/withtxn', async(_req, _res) => {
    console.log("POST /userSet1/withtxn")
    console.log(_req.body)
    let userCollection = db.collection("userSet1")
    let errorFlag = false;
    try {
        session.startTransaction()
        await userCollection.insertOne({
            name: _req.body.name
        }, {
            session
        })
        console.log(`Added ${_req.body.name} into userSet1`)
        session.commitTransaction()
        let users = await userCollection.find({}).toArray()
        _res.json(users)
    } catch (_err) {
        session.abortTransaction()
        _res.status(400).json({
            message: _err.message
        })
    }
})

app.post('/multiCollection', async(_req, _res) => {
    console.log("POST /multiCollection")
    console.log(_req.body)
    let userCollection1 = db.collection("userSet1")
    let userCollection2 = db.collection("userSet2")
    let errorFlag = false;
    try {
        session.startTransaction()
        await userCollection1.insertOne({
            name: _req.body.name
        }, {
            session
        })
        await userCollection2.insertOne({
            name: _req.body.name
        }, {
            session
        })
        console.log(`Added ${_req.body.name} into userSet1`)
        console.log(`Added ${_req.body.name} into userSet2`)
        session.commitTransaction()
        _res.json({
            message: "Done"
        })
    } catch (_err) {
        console.log(_err.message)
        session.abortTransaction()
        _res.status(400).json({
            message: _err.message
        })
    }
})

app.post('/multiCollectionNoTxn', async(_req, _res) => {
    console.log("POST /multiCollection")
    console.log(_req.body)
    let userCollection1 = db.collection("userSet1")
    let userCollection2 = db.collection("userSet2")
    let errorFlag = false;
    try {
        await userCollection2.insertOne({
            name: _req.body.name
        })
        await userCollection1.insertOne({
            name: _req.body.name
        })
        console.log(`Added ${_req.body.name} into userSet1`)
        console.log(`Added ${_req.body.name} into userSet2`)
        _res.json({
            message: "Done"
        })
    } catch (_err) {
        console.log(_err.message)
        _res.status(400).json({
            message: _err.message
        })
    }
})

app.listen(port, async() => {
    await init()
    console.log(`Server listening on port ${port}!`)
})