const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const corsOptions ={
  origin:'*',
  credentials:true,
  optionSuccessStatus:200,
  };
// middleware

app.use(cors());
app.use(express.json());
app.use(cors(corsOptions));





const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.rpuxevk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((error)=>{
      if(error){
        console.log(error)
        return;
      }
    });

    const allProductsCollection =client.db('toyMarket').collection('allproduct');
    const toyOrderCollection = client.db('toyMarket').collection('toyorder');

    app.get('/allproducts', async(req, res) => {
        const cursor =allProductsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get ('/allproducts/:id',async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const options ={
            projection: {Name: 1, Price: 1, Subcategory: 1},
        }
        const result = await allProductsCollection.findOne(query,options);
        res.send(result);
    })
    app.get('/order', async (req, res) => {
        console.log(req.query.email);
        let query ={};
        if (req.query?.email){
            query ={email: req.query.email}
        }
        const result = await toyOrderCollection.find().toArray();
        res.send(result);
    })
    app.post('/order', async (req, res) => {
        const order = req.body;
        console.log(order);
        const result = await toyOrderCollection.insertOne(order);
        res.send(result);
    });

    app.put('/order/:id', async (req,res) => {
        const updatedOrder =req.body;
    });
    app.delete('/order/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId (id)}
        const result = await toyOrderCollection.deleteOne(query);
        res.send(result);
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


app.get('/', (req,res) => {
    res.send('toys market running')
})

app.listen(port, ()=> {
    console.log(`server listening on port : ${port}`)
})