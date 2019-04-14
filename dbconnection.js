const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/googleSearch';
MongoClient.connect(uri, function(err, db) {
    if(err) {
         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
         return;
    }
    console.log('Connected...');
    exports.db = db;
//     const collection = client.db("test").collection("devices");
    // perform actions on the collection object
 });