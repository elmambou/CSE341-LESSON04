const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const db = mongodb.getDb(); // Get the database object once
        const result = await db.collection('author').find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Some error occurred while retrieving all authors.' });
    }
};


const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid author id to find an author.');
    }
    try {
        const db = mongodb.getDb(); // Get the database object once
        const userId = new ObjectId(req.params.id);
        const result = await db.collection('author').findOne({ _id: userId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message ||'Some error occurred while retrieving a single author.'});
    }
};

const createAuthor = async (req, res) => {
    try {
        const db = mongodb.getDb(); // Get the database object once
        const author = {
            name: req.body.name,
            birthDate: req.body.birthDate,
            nationality: req.body.nationality,
            biography: req.body.biography,
            website: req.body.website,
            booksWritten: req.body.booksWritten,
            awards: req.body.awards
        };
        const response = await db.collection('author').insertOne(author);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the author.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAuthor = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid author id to update an author.');
      }
    try {
        const db = mongodb.getDb(); // Get the database object once
        const userId = new ObjectId(req.params.id);
        const author = {
            name: req.body.name,
            birthDate: req.body.birthDate,
            nationality: req.body.nationality,
            biography: req.body.biography,
            website: req.body.website,
            booksWritten: req.body.booksWritten,
            awards: req.body.awards
        };
        const response = await db.collection('author').replaceOne({ _id: userId }, author);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            throw new Error('Some error occurred while updating the author.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message || 'Some error occurred while updating the author.' });
    }
};

const deleteAuthor = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid author id to delete a author.');
      }
    try {
      const db = mongodb.getDb(); // Get the database object once
      const userId = new ObjectId(req.params.id);
      const response = await db.collection('author').deleteOne({ _id: userId });
      if (response.deletedCount > 0) {
        res.status(200).send();
      } else {
        throw new Error('Some error occurred while deleting the author.');
      }
    } catch (error) {
        res.status(500).json( error.message || 'Some error occurred while deleting the author.');
    }
};


module.exports = {
    getAll,
    getSingle,
    createAuthor,
    updateAuthor,
    deleteAuthor
};
