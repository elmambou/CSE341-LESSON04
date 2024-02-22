const express = require('express');
const router = express.Router();
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  //secret: 'a long, randomly-generated string stored in env',
  secret: 'L4Nn6uqVY-a9Aymvm4HC8wg6CFh2y5TBkpQzfjX--VxRnK0xubARlQmoOteu4rs3',
  baseURL: 'http://localhost:8083',
  clientID: 'miKUC6dSx08gOyJVyV053rbHi9A4JpPo',
  issuerBaseURL: 'dev-lbodsr1ycluh2vxj.us.auth0.com'
};

router.use(auth(config));

router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

module.exports = router;