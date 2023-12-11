const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// 1u6V60Tw909IsUKM

app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://jerins:1u6V60Tw909IsUKM@cluster0.35nuqgc.mongodb.net/?retryWrites=true&w=majority";

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

        const serviceCollection = client.db('jerins').collection('services')
        const testimonialCollection = client.db('jerins').collection('testimonials')
        const usersCollection = client.db('jerins').collection('users')
        const bookingList = client.db('jerins').collection('bookings')
        const projectCollection = client.db('jerins').collection('projects')

        app.get('/services',async(req,res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/services',async(req,res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        app.post('/testimonials',async(req,res) => {
            const cursor = req.body;
            const result = await testimonialCollection.insertOne(cursor);
            res.send(result)
        })
        app.post('/projects',async(req,res) => {
            const cursor = req.body;
            const result = await projectCollection.insertOne(cursor);
            res.send(result)
        })

        app.get('/testimonials',async(req,res) => {
            const cursor = testimonialCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/projects',async(req,res) => {
            const cursor = projectCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/admin/:email', async (req,res) => {
            const email = req.params.email;
            const query = {email:email};
            const user = await usersCollection.findOne(query);
            let admin = false;
            if(user){
                admin = user?.role === 'admin'
            }
            res.send({admin})
        })

        app.patch('/users/admin/:id',async (req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })

        app.post('/users',async(req,res) => {
            const user = req.body
            const query = {email:user.email}
            const existingUser = await usersCollection.findOne(query)
            if(existingUser){
                return res.send({message: 'already exist', insertedId: null})
            }
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })

        app.post('/bookings',async(req,res) => {
            const book =req.body;
            const result = await bookingList.insertOne(book);
            res.send(result);
        })

        app.get('/bookings', async(req,res) => {
            const email = req.query.email;
            const query = {email:email}
            const result = await bookingList.find(query).toArray();
            res.send(result)
        })

        app.get('/users',async(req,res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('jerin is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})