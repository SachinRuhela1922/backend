const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();


const app = express()
app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGO_URI)
let db

async function start() {
  try {
    await client.connect()
    db = client.db("data")
    console.log("MongoDB connected")
    app.listen(3000, () => console.log("Server running on port 3000"))
  } catch (err) {
    console.error(err)
  }
}
start()

app.post("/submit", async (req, res) => {
  try {
    const { name, email } = req.body
    const result = await db.collection("formdata").insertOne({ name, email })
    res.json({ success: true, insertedId: result.insertedId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
})

app.get("/formdata", async (req, res) => {
  try {
    const data = await db.collection("formdata").find().toArray()
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false })
  }
})
