# nodejs-mongodb-transactions
Exploring MongoDB transactions on Nodejs. This is just a collection of samples.

# Setup

* *DB name* : cbs (Core Banking System)
* *Collections*:
  * userSet1
    * Unique index set on name
  * userSet2

> P.S. Everytime you start the server, the collections are reset and reloaded with data.

# APIs

| API | Description |
|---|---|
| GET /userSet1 | Lists all the users under collection `userSet1` |
| GET /userSet2 | Lists all the users under collection `userSet2` |
| POST /userSet1 | Add new user under collection `userSet1`. Uses mongoDB transactons for a single document entry. Sample payload `{"name": "Geetha"}` |
| POST /multiCollection | Use mongoDB transactions to add new user under collections `userSet1` and `userSet2`. Sample payload `{"name": "Faizal"}` |
| POST /multiCollectionNoTxn | Add new user under collections `userSet1` and `userSet2` without any mongoDB transactions. Sample payload `{"name": "Geetha"}` |
