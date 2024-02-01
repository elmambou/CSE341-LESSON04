const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();

const contactRoutes = require('./routes/contacts');

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });

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





//app
  //.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
//  .use(cors())
  //.use(express.json())
  //.use(express.urlencoded({ extended: true }))
  //.use('/', require('./routes'));


  ///const db = require('./models');
  //db.mongoose
   // .connect(db.url, {
     // .useUnifiedTopology: true,
      //.useUnifiedTopology: true,
    //}) // Removed useNewUrlParser option
    //.then(() => {
      //console.log('Connected to the database!');
    //})
    //.catch((err) => {
     // console.log('Cannot connect to the database!', err);
    //  process.exit();
    //});



//const PORT = process.env.PORT || 8080;
//app.listen(PORT, () => {
 // console.log(`Server is running on port ${PORT}.`);
  //console.log(`ctrl+click http://localhost:${port}/temples`)
  //console.log(`ctrl+click http://localhost:${port}/api-docs`)
//});
