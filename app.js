const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');

//graphQL
const { graphqlHTTP } = require('express-graphql'); // Corrected import statement
const schema = require('./schema');


const port = process.env.PORT || 8083;
const app = express();



//This route will be used as an endpoint to interact with Graphql, 
//All queries will go through this route. 
app.use('/graphql', graphqlHTTP((req) => ({
  schema,
  graphiql: true,
  context: { db: app.locals.db }, // Pass the MongoDB connection to the context
})));


//End of GraphQL




const contactRoutes = require('./routes/contacts');

const { auth, requiresAuth } = require('express-openid-connect');
//Update .env file with render link before pushing
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
  };
  
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
// app.use((req, res, next) => {
//   if (!req.oidc.isAuthenticated()) {
//     return res.status(401).json({error: 'Not authorized'});
//   }
//   next();
// })

app.get('/profile', requiresAuth(), (req, res) => {
  console.log(JSON.stringify(req.oidc.user))
  res.send(JSON.stringify(req.oidc.user));
}) 
//End OAuth




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
    
    .use('/', require('./routes'))
    .use('/contacts', contactRoutes);

process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});


mongodb.initDb()
    .then(() => {
        app.locals.db = mongodb.getDb();


        app.listen(port, () => {
            console.log(`Connected to DB and listening on ${port}`);
            console.log(`http://localhost:${port}/contacts`);
            console.log(`http://localhost:${port}/api-docs`);
          
        });
    })
    .catch((err) => {
        console.error('Error starting the app:', err);
    });

