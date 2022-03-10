
const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4i3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    // console.log("connected to database")
    const database = client.db('travelguru');
    const serviceCollection = database.collection('services')
    const orderCollection = database.collection('orders')


    //  get all data api
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    })

    // Get Single Service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })


    // Post api
    app.post('/services', async (req, res) => {
      const service = req.body;
      console.log('hit the post api', service)
      const result = await serviceCollection.insertOne(service)
      // res.send('post hitted')
      console.log(result);
      res.json(result)
    })

    // add orders api
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    })
    // Get Single Service
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })


    // get api using email
    app.get("/myorder/:email", async (req, res) => {
      const email = req.params.email;
      const myorder = await orderCollection.find({ email }).toArray();
      // console.log(mybookings);
      res.send(myorder);
    });

    
    // delete api for my booking
    app.delete("/myorder/:id", async (req, res) => {
      const Id = req.params.id;
      const query = { _id: ObjectId(Id) };
      const deleteBooking = await orderCollection.deleteOne(query);
      // console.log(deleteBooking);
      res.json(deleteBooking);
    });

// All customer order 
    app.get("/allorder", async (req, res) => {
      const allorder = await orderCollection.find({}).toArray();
      res.send(allorder);
    });

    // 
    // update api for status
    app.put("/myorder/:id", async (req, res) => {
      const updateId = req.params.id;
      const updatedStatus = req.body;
      // console.log(updatedStatus);
      const filter = { _id: ObjectId(updateId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedStatus.status,
        },
      };

      // === ==========
      const approved = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log(result);

      res.json(approved);
    });




  }
  finally {

  }
}

run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("travel guru");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});