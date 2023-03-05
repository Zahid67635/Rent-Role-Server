const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gtp2h2a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allPropertyCollection = client.db('Rent_Roll').collection('all_properties');
        const usersCollection = client.db('Rent_Roll').collection('users');
        const bookingsCollection = client.db('Rent_Roll').collection('bookingsCollection');
        const hostReqCollection = client.db('Rent_Roll').collection('hostReqCollection');
        app.get('/allProperties', async (req, res) => {
            const query = {};
            const properties = await allPropertyCollection.find(query).toArray();
            res.send(properties);
        });
        app.post('/allProperties', async (req, res) => {
            const data = req.body
            const properties = await allPropertyCollection.insertOne(data)
            res.send(properties);
        });
        app.get('/allProperties/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            const result = await allPropertyCollection.findOne(query);
            res.send(result);
        })
        app.get('/searchProperties/:location', async (req, res) => {
            const Location = req.params.location;
            const query = { Location: Location };
            const result = await allPropertyCollection.find(query).toArray();
            res.send(result);
        })

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const userDetails = req.body;
            console.log(userDetails, email);
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: userDetails,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            res.send(user)
        })

        app.put('/hostRequests', async (req, res) => {
            const data = req.body
            const result = await hostReqCollection.insertOne(data);
            res.send(result);
        })
        app.post('/bookings', async (req, res) => {
            const data = req.body
            const result = await bookingsCollection.insertOne(data);
            res.send(result);
        })
        app.get('/bookings', async (req, res) => {
            const owner = req.query.owner;
            const query = { owner };
            const result = await bookingsCollection.findOne(query)
            res.send(result);
        })
        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await bookingsCollection.find(query).toArray();
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