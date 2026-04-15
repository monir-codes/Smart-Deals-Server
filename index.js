import { createRequire } from 'module';
const require = createRequire(import.meta.url);


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());


import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-crud-cluster.0hdbxiy.mongodb.net/?appName=Simple-crud-cluster`;

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
    // Send a ping to confirm a successful connection
    const db = client.db('smart_user');
    const productsCollection = db.collection('products');

    app.get('/', async(req, res)=>{
        res.send('Server is running..');
    });


    app.get('/api/products', async(req, res)=>{
        const cursor = productsCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/api/recent-products', async(req, res)=>{
        const cursor = productsCollection.find({}).sort({ _id: -1 }).limit(6);
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/api/product/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await productsCollection.findOne(query);
        res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

run().catch(console.dir);
