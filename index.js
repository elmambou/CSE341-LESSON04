const express = require('express');
const cors = require('cors'); // import cors module
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes'));


  const db = require('./models');
  db.mongoose
    .connect(db.url, {
      useUnifiedTopology: true,
      useUnifiedTopology: true,
    }) // Removed useNewUrlParser option
    .then(() => {
      console.log('Connected to the database!');
    })
    .catch((err) => {
      console.log('Cannot connect to the database!', err);
      process.exit();
    });



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  //console.log(`ctrl+click http://localhost:${port}/temples`)
  //console.log(`ctrl+click http://localhost:${port}/api-docs`)
});
