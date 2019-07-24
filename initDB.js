// data
const data = require("./data")

function clearCollection(_collection) {
    return new Promise(_res => _collection.drop({}, () => _res()))
}

module.exports = async(_client, _db) => {
    let col = _db.collection("userSet1")
    try {
        await clearCollection(col)
        await col.insertMany(data.init.userSet1)
        await col.createIndex("name", {
            unique: "true",
            name: "UserNameIndex"
        })
        let count = await col.countDocuments({})
        console.log(`Inserted ${count} users into userSet1`)
        col = _db.collection("userSet2")
        await clearCollection(col)
        await col.insertMany(data.init.userSet2)
        count = await col.countDocuments({})
        console.log(`Inserted ${count} users into userSet2`)
    } catch (_err) {
        console.log(_err.message)
    }
};