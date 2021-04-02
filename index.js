const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
const port = 5000;


const MongoClient = require('mongodb').MongoClient;
const  ObjectId  = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j1wjl.mongodb.net/food-house?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("food-house").collection("products");
  const ordersCollection = client.db("food-house").collection("orders");
  // perform actions on the collection object
  // client.close();

  app.get('/products',(req,res)=>{
    productsCollection.find().toArray((err,items) => {
       console.log('from database ',items)
       res.send(items)
    })
  })


  app.post("/addProduct",(req,res)=>{
    const newProduct = req.body;
    console.log('Adding New Product ',newProduct)
    productsCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  app.delete('/deleteProduct/:id',(req,res)=>{
    const id = ObjectId(req.params.id);
    productsCollection.findOneAndDelete({_id:id})
    .then(documents =>res.send(!!documents.value))
  })

  app.post("/addOrder",(req,res)=>{
    const order = req.body;
    console.log('Adding New order ',order)
    ordersCollection.insertOne(order)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  app.get('/checkout/:id',(req,res)=>{
    const id = ObjectId(req.params.id);
    productsCollection.find({_id:id})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  app.get('/orders',(req,res)=>{
    ordersCollection.find().toArray((err,items) => {
       console.log('from database ',items)
       res.send(items)
    })
  })



  console.log("Database Connected")
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`listening at http://localhost:${port}`)
})