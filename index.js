const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('hello world')
})

// include mongodb connection
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ssjj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const AppointmentCollection = client.db(process.env.DB_NAME).collection(process.env.SUB_DB_APPOINTMENT);
    const reviewsCollection = client.db(process.env.DB_NAME).collection(process.env.SUB_DB_REVIEWS);
    const doctorCollection = client.db(process.env.DB_NAME).collection(process.env.SUB_DB_DOCTORS);
    const blogsCollection = client.db(process.env.DB_NAME).collection(process.env.SUB_DB_BLOGS);
    const bookingCollection = client.db(process.env.DB_NAME).collection(process.env.SUB_DB_BOOKING_CARD);

    // ! *************** GET METHOD *************

    //  get reviews form database 
    app.get('/reviews', (request, response) => {
        reviewsCollection.find({})
            .toArray((error, documents) => {
                response.send(documents)
            })
    })
    //  get doctors form database 
    app.get('/doctors', (request, response) => {
        doctorCollection.find({})
            .toArray((error, documents) => {
                response.send(documents)
            })
    })
    // get a single doctor by id
    app.get('/editdoctor/:id', (request, response) => {
        const getDoctor = request.params.id;
        doctorCollection.find({ _id: ObjectId(getDoctor) })
            .toArray((error, singleDoctor) => {
                response.send(singleDoctor[0])
            })
    })
    // get blogs form database
    app.get('/blogs', (request, response) => {
        blogsCollection.find({})
            .toArray((error, documents) => {
                response.send(documents)
            })
    })
    // get booking card from database
    app.get('/bookingCard', (request, response) => {
        bookingCollection.find({})
            .toArray((error, documents) => {
                response.send(documents)
            })
    })
    // get appointment list form database
    app.get('/allAppointments', (request, response) => {
        AppointmentCollection.find({})
            .toArray((error, documents) => {
                response.send(documents)
            })
    })

    // ! **************** POST METHOD **************

    //  post reviews to the database
    app.post('/peopleReviews', (request, response) => {
        const reviews = request.body;
        reviewsCollection.insertOne(reviews)
            .then(result => {
                response.send(result)
                console.log(result)
            })
    })
    //  post doctors information to the database
    app.post('/addDoctors', (request, response) => {
        const doctors = request.body;
        doctorCollection.insertOne(doctors)
            .then(result => {
                response.send(result)
                console.log(result)
            })
    })

    // post blogs to the database
    app.post('/addBlogs', (request, response) => {
        const blogs = request.body;
        blogsCollection.insertOne(blogs)
            .then(result => {
                response.send(result)
                console.log(result)
            })
    })

    // post booking card to database
    app.post('/addBookingCard', (request, response) => {
        const bookingCard = request.body;
        bookingCollection.insertOne(bookingCard)
            .then(result => {
                response.send(result)
                console.log(result)
            })
    })
    // post appointment info to database
    app.post('/addAppointment', (request, response) => {
        const appointment = request.body
        AppointmentCollection.insertOne(appointment)
            .then(result => {
                response.send(result)
                console.log(result)
            })
    })
    // post appointment by date to database
    app.post('/appointmentByDate', (request, response) => {
        const date = request.body;
        AppointmentCollection.find({ date: date.date })
            .toArray((error, documents) => {
                response.send(documents)
            })
    })

    // filter dashboard component by admin access
    app.post('/admincontrol', (request, response) => {
        const email = request.body.email;
        doctorCollection.find({ email: email })
            .toArray((error, admin) => {
                response.send(admin.length > 0)
            })
    })

    // ! ********** UPDATE METHOD **********
    // UPDATE DOCTORS INFORMATION
    app.put('/updatedoctorinfo/:id', (request, response) => {
        const doctorUpdate = request.params.id;
        doctorCollection.updateOne({ _id: ObjectId(doctorUpdate) },
            {
                $set: {
                    name: request.body.name,
                    designation: request.body.designation,
                    email: request.body.email,
                    phone: request.body.phone,
                }
            }
        )
            .then(result => {
                response.send(result.modifiedCount > 0)
            })
    })


    // ! ********* DELETE METHOD **********
    // delete appointment from database
    app.delete('/deleteAppointment/:id', (request, response) => {
        const deleteAppointment = request.params.id;
        AppointmentCollection.deleteOne({ _id: ObjectId(deleteAppointment) })
            .then(result => {
                response.send(result)
            })
    })

    // delete doctor from database
    app.delete('/deletedoctor/:id', (request, response) => {
        const deleteDoctor = request.params.id;
        doctorCollection.deleteOne({ _id: ObjectId(deleteDoctor)})
        .then(result => {
            response.send(result);
        })
    })

    console.log('database connected')
});

// ! ********* PORT LISTENING *******
const port = 1000;
app.listen(process.env.PORT || port, () => {
    console.log(`port listening ${port}`)
})