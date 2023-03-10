// server.js
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://sa:2345@cluster0.syir52w.mongodb.net/?retryWrites=true&w=majority'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')        
        // (1a) CREATE: client -> create -> database -> 'vn-toys'
        // -> create -> collection -> 'toys'
        const db = client.db('vn-toys')
        const toysCollection = db.collection('toys')
        
        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs') 
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'toys' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('toys').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { toys: results })
                })
                .catch(/* ... */)
        })
        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/toys' -> collection -> insert -> result
        app.post('/toys', (req, res) => {
            toysCollection.insertOne(req.body)
            .then(result => { 
                // results -> server -> console
                console.log(result)
                // -> redirect -> '/'
                res.redirect('/')
             })
            .catch(error => console.error(error))
        })
        // server -> listen -> port -> 3000
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })


