const express = require("express")
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
require("dotenv").config()
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const port = process.env.PORT || 5000
const cors = require("cors")

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eghsqmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    await client.connect()
    const database = client.db("Resort")
    // collection create
    const blogCollection = database.collection("Blog")
    const roomCollection = database.collection("Rooms")

    // get all blogs Data
    app.get("/blogs", async (req, res) => {
      const blogs = blogCollection.find()
      const result = await blogs.toArray()
      res.send(result)
    })

    // single blog data get
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const blog = await blogCollection.findOne(query)
      res.send(blog)
    })

    // get all rooms data
    app.get("/rooms", async (req, res) => {
      const rooms = roomCollection.find()
      const result = await rooms.toArray()
      res.send(result)
    })

    // single room data get
    app.get("/rooms/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const room = await roomCollection.findOne(query)
      res.send(room)
    })

    await client.db("admin").command({ ping: 1 })
    console.log("You successfully connected to MongoDB!")
  } finally {
  }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Resort Server")
})

app.listen(port, () => {
  console.log(`Server is running on Port :  ${port}`)
})
