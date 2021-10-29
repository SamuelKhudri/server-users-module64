//--------initialize expres------
const express = require('express');
const cors = require('cors');
// require id for delete
const ObjectId = require('mongodb').ObjectId;
// mongo initialize
const { MongoClient } = require('mongodb');
const app = express();
//-------port define--------userdb-1 xYEZ1jk4djh0Op4U
const port = process.env.port || 5000;
// Middleware
app.use(cors());
app.use(express.json());


// ---mongo db  body code
const uri = "mongodb+srv://userdb-1:xYEZ1jk4djh0Op4U@cluster0.gqter.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");
        // get data from database after that we will show this
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // Post Api from ui
        app.post('/users', async (req, res) => {
            // 2nd part after hitt
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // first part
            console.log('hitting the data', req.body);
            console.log('added user', result);
            // res.send('data hitted baby');
            res.json(result);
        })

        // set delete state just 2 step for delete 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('deleted id', result);
            res.json(result);
        })
        // user update from server to show
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
            // ai part er pore data ta /5000/users/id te pabo
        })

        // take updated data to client and put to the database

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('mongo baby love');
})

app.listen(port, () => {
    console.log('listening the port', port);
})


//  first step to check the data base that it is okay or not

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log('hitting the DataBase')
//     const user = { name: 'munira', email: 'munira55@gmail.com', phone: '189987878' };
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert success');
//         })
//     // client.close();
// });

// function cal to get data

// 2nd step hit the data base 
 // create a document to insert
        // const doc = {
        //     name: "special-one",
        //     title: "special999@gmail.com",
        // }
        // const result = await usersCollection.insertOne(doc);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);