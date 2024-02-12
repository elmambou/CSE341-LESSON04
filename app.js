const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');

const port = process.env.PORT || 3000;
const app = express();

const contactRoutes = require('./routes/contacts');




// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json())
   .use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
 next();
})



// Routes
mongodb.initDb()
    .then(() => {
        app.locals.db = mongodb.getDb();

        app.use('/', require('./routes'));
        app.use('/contacts', contactRoutes);

        app.listen(port, () => {
            console.log(`Connected to DB and listening on ${port}`);
            console.log(`http://localhost:${port}/contacts`);
        });
    })
    .catch((err) => {
        console.error('Error starting the app:', err);
    });

