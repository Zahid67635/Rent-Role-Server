const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gtp2h2a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allPropertyCollection = client.db('Rent_Roll').collection('all_properties');
        const usersCollection = client.db('Rent_Roll').collection('users');
        app.get('/allProperties', async (req, res) => {
            const query = {};
            const properties = await allPropertyCollection.find(query).toArray();
            res.send(properties);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(er => console.log(er))

app.get('/', (req, res) => {
    res.send('Server for Rent-roll')
})

app.listen(port, () => console.log('port is running'))