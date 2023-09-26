
const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://imSani:BrRhF9dsiBgz1rgu@cluster0.dr6rb.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });


async function run() {

    try {
        const allServiceCollection = client.db('sanyDatabase').collection('Services');
        const adminsCollection = client.db('sanyDatabase').collection('Admins');
        const allbookinList = client.db('sanyDatabase').collection('allBookings');
        const allreviewList = client.db('sanyDatabase').collection('allReviews');

        // get all service list section *******************************

        app.get('/getAllService', async (req, res) => {
            const query = {};
            const cursor = allServiceCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
            // console.log(data)
        })

        // delete single service section *******************************

        app.delete('/deleteService/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allServiceCollection.deleteOne(query);
            res.send(result);
        })



        // detail single service section *******************************

        app.get('/detailSingleService/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allServiceCollection.findOne(query);
            res.send(result);
        })

        // update single service section *******************************


        app.put('/updateService/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const info = req.body;
            const option = { upsert: true };
            const update = {
                $set: {
                    ServiceTittle: info.ServiceTittle,
                    serviceImage: info.serviceImage,
                    lisOfServices: info.lisOfServices,
                    Discription: info.Discription,
                }
            }
            const result = await allServiceCollection.updateOne(filter, update, option);
            res.send(result);

        })

        // get all booking list section *******************************

        app.get('/getAllBookingData', async (req, res) => {
            const query = {};
            const cursor = allbookinList.find(query);
            const data = await cursor.toArray();
            res.send(data);
        })



        // get all review list section *******************************

        app.get('/getAllReviewData', async (req, res) => {
            const query = {};
            const cursor = allreviewList.find(query);
            const data = await cursor.toArray();
            res.send(data);
        })


         // get Specific booking list section *******************************

         app.get('/specificBookings', async (req, res) => {
            const emailreq = req.query.email;
            let query={};
            if(req.query?.email){
                query = { clientEmail: req.query.email };
            }
            const data = await allbookinList.find(query).toArray();
            // console.log(emailreq);
            res.send(data);
        })

        // add new booking section ************************************

        app.post('/newClientBoking', async (req, res) => {
            const data = req.body;
            const result = await allbookinList.insertOne(data);
            // console.log(result)
            res.send(result);
        })

        // change single booking status section ************************************


        app.put('/changeStatus/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateInfo = {
                $set: {
                    status: data.status
                }
            }
            const result = await allbookinList.updateOne(filter, updateInfo, option);
            // console.log(result);
            res.send(result);
        })

        // delete single bookinglist section ************************************


        app.delete('/deleteSingleBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allbookinList.deleteOne(query);
            // console.log(result);
            res.send(result);
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


        // Access  admin section *******************************


        app.post('/isAdminHere', async (req, res) => {
            const email = req.body.adminEmail;
            const query = { adminEmail: email };
            const cursor = adminsCollection.find(query);
            const data = await cursor.toArray();
            res.send(data.length > 0);
        });



        /// add new service section *******************************

        app.post('/addNewService', async (req, res) => {
            const data = req.body;
            const result = await allServiceCollection.insertOne(data);
            res.send(result);
            console.log(result);
        });


         /// add new review section *******************************

         app.post('/addNewReview', async (req, res) => {
            const data = req.body;
            const result = await allreviewList.insertOne(data);
            res.send(result);
            console.log(result);
        });
    }
    finally {

    }


}
run();

app.get('/', (req, res) => {
    res.send('Hello my World!')
})
app.listen(4000)