const swaggerAutogen = require('swagger-autogen')();

//const doc = {
  //info: {
   // title: 'My API',
    //description: 'Contact API'
  //},
  //host: 'localhost:8083', 
  //schemes: ['http'],      
//};

//const outputFile = './swagger.json';
//const endpointsFiles = ['./routes/index.js'];

const doc = {
  info: {
    title: 'My API',
    description: 'Contact API'
  },
  host: 'localhost:8083',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'contacts',
      description: 'Operations related to contacts'
    }
  ],
  definitions: {
    Contact: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        favoriteColor: { type: 'string' },
        birthday: { type: 'string' }
      },
      required: ['firstName', 'lastName', 'email', 'favoriteColor']
    }
  }
};

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
