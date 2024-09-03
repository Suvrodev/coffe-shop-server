const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const we = require("./Data/We.json");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const userName = process.env.DB_USER;
const userPassword = process.env.DB_PASSWORD;

console.log("User: ", userName, " Password: ", userPassword);

app.get("/", (req, res) => {
  console.log(`Coffie is Running on port ${port}`);
  res.send(`Coffie is Running on port ${port}`);
});

app.get("/we", (req, res) => {
  res.send(we);
});

app.get("/we/:id", (req, res) => {
  const id = req.params.id;
  console.log("Id: ", id);

  const target = we.find((w) => w.id === id);
  res.send(target);
  console.log(target);
});

///////////MongoDB Start

const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.jokwhaf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    ///Make Collection start
    const userCollection = client.db("userDB").collection("users");
    const coffeCollection = client.db("coffeeDB").collection("coffee");
    ///Make Collection end

    ////Database Work start

    ///Post Data
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log("New User", user);

      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    ///Post Data end

    ///Retrive Data start
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    ///Retrive data end

    //Retrive Single data start
    app.get("/users/:id", async (req, res) => {
      // console.log("Single data");
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    //Retrive Single data end

    ///Delete Data start
    app.delete("/user/:id", async (req, res) => {
      console.log("Here");
      const id = req.params.id;
      console.log("Delete id: ", id);

      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    ///Delete Data end

    ///Put Start
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;

      const filter = { _id: new ObjectId(id) };
      // const options = { upsert: true };

      const newUpdatedUser = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };

      const result = await userCollection.updateOne(filter, newUpdatedUser);

      res.send(result);
    });
    ///Put End

    ///Post Coffee start
    app.post("/coffee", async (req, res) => {
      const coffee = req.body;
      console.log("Come from coffee");
      console.log(coffee);

      const result = await coffeCollection.insertOne(coffee);
      res.send(result);
    });
    ///Post Coffee end

    //Get Coffee Start
    app.get("/coffee", async (req, res) => {
      const result = await coffeCollection.find().toArray();
      res.send(result);
    });
    //Get Coffee End

    //Get Single Coffee start
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.findOne(query);
      res.send(result);
    });
    //Get Single Coffee start

    ///Delete Single Coffe Start
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Got Id: ", id);

      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    });
    ///Delete Single Coffe End

    ///Modify Coffee start
    app.patch("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      console.log("Update Come ID: ", id);
      const filter = { _id: new ObjectId(id) };
      const updateCoffee = {
        $set: {
          ...coffee,
        },
      };
      const result = await coffeCollection.updateOne(filter, updateCoffee);
      res.send(result);
    });
    ///Modify Coffee end

    ////Database Work End
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

///////////MongoDB End

app.listen(port, () => {
  console.log(`Coffie is Running on port ${port}`);
});
