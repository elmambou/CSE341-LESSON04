const express = require('express');
const router = express.Router();
const security = require('../middleware/authorize.js');

const contactsController = require('../controllers/contacts');


//const validation = require('../middleware/validate');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getSingle);

router.post('/', security.checkLogin, contactsController.createContact);

router.put('/:id', security.checkLogin, contactsController.updateContact);

router.delete('/:id', contactsController.deleteContact);

module.exports = router;
