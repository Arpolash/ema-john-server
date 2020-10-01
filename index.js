const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express()
app.use(bodyParser.json());
app.use(cors())
const port = 5000
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjfoa.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology : true});

client.connect(err => {
  const products = client.db(`${process.env.DB_DATABASE}`).collection(`${process.env.DB_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_DATABASE}`).collection('orders');
  app.post('/addProduct', (req,res) =>{
    const product = req.body;
    products.insertMany(product)
    .then(result => {
      console.log(result.insertedCount)
      res.send(result.insertedCount);
    })
  })

  app.get('/products',(req,res) =>{
    products.find({})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

  app.get('/product/:key',(req,res) =>{
    products.find({key : req.params.key})
    .toArray((err,documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/addOrders', (req,res) =>{
    const order = req.body;
    ordersCollection.insertMany(order)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

});


app.listen(process.env.PORT || port)