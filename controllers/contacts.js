const mongodb = require('../db/connect');  
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb(); // Get the database object once
    const result = await db.collection('contacts').find().toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(response.error || 'Some error occurred while retrieving all contacts.');
  }
};



const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to find a contact.');
      }
  try {
    const db = mongodb.getDb(); // Get the database object once
    const userId = new ObjectId(req.params.id);
    const result = await db.collection('contacts').findOne({ _id: userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(response.error || 'Some error occurred while retrieving a single contact.');
  }
};

const createContact = async (req, res) => {
  try {
    const db = mongodb.getDb(); // Get the database object once
  const contact = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          favoriteColor: req.body.favoriteColor,
          birthday: req.body.birthday
        };
        const response = await db.collection('contacts').insertOne(contact);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the author.');
    }
} catch (error) {
  res.status(500).json({ error: error.message });
}
};




const updateContact = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to update a contact.');
      }
    try {
      const db = mongodb.getDb(); // Get the database object once
      const userId = new ObjectId(req.params.id);
      const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
      };
      const response = await db.collection('contacts').replaceOne({ _id: userId }, contact);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        throw new Error('Some error occurred while updating the contact.');
      }
    } catch (error) {
      res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
  };
  
  const deleteContact = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a contact.');
      }
    try {
      const db = mongodb.getDb(); // Get the database object once
      const userId = new ObjectId(req.params.id);
      const response = await db.collection('contacts').deleteOne({ _id: userId });
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        throw new Error('Some error occurred while deleting the contact.');
      }
    } catch (error) {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
  };
  
  module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
  };