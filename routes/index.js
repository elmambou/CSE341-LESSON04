const routes = require('express').Router();
const temple = require('./temple');

routes.use('/', require('./swagger'));
routes.use('/temples', temple);
routes.use(
  '/',
  (docData = (req, res) => {
    let docData = {
      documentationURL: 'https://github.com/elmambou/CSE341-LESSON04.git',
    };
    res.send(docData);
  })
);

module.exports = routes;