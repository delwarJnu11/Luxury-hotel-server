const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ec0jk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('luxury-hotel');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');


        //GET SERVICE API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        // load single course get api
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });

        //Post add service
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.json(result);
        })
        //POST API
        app.post('/orders', async (req, res) => {
            const newUser = req.body
            console.log(newUser)
            const result = await orderCollection.insertOne(newUser)
            console.log('added user ', result);
            res.json(result)
        })

        //Get 
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const users = await cursor.toArray();
            res.json(users);
        })
        // get  orders API
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({ email: email }).toArray();
            res.json(result);
        });

        //Delete api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        });

        //Put Api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updatedUser.status,

                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
//GET API
app.get('/', (req, res) => {
    res.send('Luxury Hotel Server is Running.');
});

//LISTEN
app.listen(port, () => {
    console.log('Luxury Hotel Server is Running at Port: ', port);
});