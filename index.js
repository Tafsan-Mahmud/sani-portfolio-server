


const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors());
app.use(express.json());

// user- imSani
// pass- BrRhF9dsiBgz1rgu



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://imSani:BrRhF9dsiBgz1rgu@cluster0.dr6rb.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });


async function run() {
    
   try{
    const allServiceCollection = client.db('sanyDatabase').collection('Services');
    const adminsCollection = client.db('sanyDatabase').collection('Admins');
    const allbookinList = client.db('sanyDatabase').collection('allBookings');




 // get all service list section *******************************
 
 app.get('/getAllService', async(req, res)=>{
     const query = {};
     const cursor = allServiceCollection.find(query);
     const data = await cursor.toArray();
     res.send(data);
     // console.log(data)
    })
    
    
    // delete single service section *******************************

    app.delete('/deleteService/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id:new ObjectId(id)}
        const result = await allServiceCollection.deleteOne(query);
        res.send(result);
    })

    // update single sewrvice section *******************************

    
    app.put('/updateService/:id', async(req, res)=>{
        const id = req.params.id;
        const filter ={_id: new ObjectId(id)};
        const info = req.body;
        const option = {upsert:true};
        const update = {
            $set:{
                ServiceTittle:info.ServiceTittle,
                serviceImage:info.serviceImage,
                lisOfServices:info.lisOfServices,
                Discription:info.Discription,
            }
        }
        const result = await allServiceCollection.updateOne(filter,update, option);
        res.send(result);

    })



    // get all booking list section *******************************

    app.get('/getAllBookingData', async(req, res)=>{
        const query = {};
        const cursor = allbookinList.find();
        const data = await cursor.toArray();
        res.send(data);
    })


    // Make admin section *******************************

    app.post('/makeAdmin', async (req, res) => {
        const email = req.body.adminEmail;
        const check = await adminsCollection.findOne({ adminEmail: email })
        if (check === null) {
            adminsCollection.insertOne({ adminEmail: email })
                .then(result => {
                    res.sendStatus(200);
                });
        }
        else {
            res.sendStatus(404);
        }
    });

   /// add new service section *******************************

   app.post('/addNewService', async(req, res)=>{
    const data = req.body; 
    const result = await allServiceCollection.insertOne(data);
    res.send(result);
    console.log(result);
   });



   }
   finally{

   }


}
run().catch(console.dir);










app.get('/check', (req, res) => {
    res.send('Hello my World!')
})
app.listen(4000)