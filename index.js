const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_PLAYER}:${process.env.DB_PLAYERPASS}@cluster0.phy8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("players");
        const playersData = database.collection("playersData");


        app.get('/players', async (req, res) => {
            const cursor = playersData.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/players/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await playersData.findOne(query);
            res.send(result)
        })

        app.post('/players', async (req, res) => {
            const userBody = req.body
            const result = await playersData.insertOne(userBody);
            res.send(result)
        })

        app.put('/players/:id', async (req, res) => {

            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const upform = req.body

            const updateDoc = {
                $set: {
                    name: upform.name,
                    country: upform.country,
                    clubnumber: upform.clubnumber,
                    position: upform.position,
                    image: upform.image,
                    price: upform.price,
                }
            }

            const result = await playersData.updateOne(filter, updateDoc, options);
            res.send(result)

        })
        app.delete('/players/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await playersData.deleteOne(query);
            res.send(result)
        })

        
        // firebase set up/

        app.get('/users', async (req, res) => {
            const cursor = playersData.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const userBody = req.body
            const result = await playersData.insertOne(userBody);
            res.send(result)
        })


        app.patch('/users/:email', async (req, res) => {

            const email = req.params.email
            const filter = { email };
            const options = { upsert: true };
            const logform = req.body

            const updateDoc = {
                $set: {
                    loginObj: logform?.loginObj
                }
            }

            const result = await playersData.updateOne(filter, updateDoc, options);
            res.send(result)

        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get("/", (req, res) => {
    res.send("Hlw World")
})

app.listen(port, () => {
    console.log(`server coltace ${port}`);
})