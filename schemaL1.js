const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
  } = require('graphql');

  const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB package
  const Contact = require('./models/contacts')

// Define Contact type
const ContactType = new GraphQLObjectType({
    name: 'Contact',
    fields: () => ({
        _id: { type: GraphQLString }, // Add _id field
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        favoriteColor: { type: GraphQLString },
        birthday: { type: GraphQLString }
    })
});

// Define Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        contact: {
            type: ContactType,
            args: {
                firstName: { type: GraphQLString }
            },
            resolve(parent, args, context) {
                // Your logic to retrieve a single contact by firstName
                // This could be querying from MongoDB using Mongoose
            }
        },
        contacts: {
            type: new GraphQLList(ContactType),
            resolve(parent, args, context) {
                // Logic to retrieve all contacts from MongoDB using Mongoose
                return context.db.collection('contacts').find().toArray(); // Example assuming 'contacts' is your MongoDB collection
            }
        }
    }
});

// Define Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addContact: {
            type: ContactType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type:new GraphQLNonNull(GraphQLString) },
                favoriteColor: { type:new GraphQLNonNull(GraphQLString) },
                birthday: { type:new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args, context) {
                // Your logic to add a new contact to the database
                // This could involve creating a new document in MongoDB using Mongoose
            }
        },
        updateContact: {
            type: ContactType,
            args: {
                _id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                favoriteColor: { type: GraphQLString },
                birthday: { type: GraphQLString }
            },
            resolve(parent, args, context) {
                const { db } = context;
                const { _id, ...updateFields } = args;

                // Convert the _id argument to ObjectId
                const objectId = new ObjectId(_id);

                return db.collection('contacts').updateOne(
                    { _id: objectId },
                    { $set: updateFields }
                ).then(() => {
                    // Return the updated contact
                    return db.collection('contacts').findOne({ _id: objectId });
                }).catch(err => {
                    throw new Error('Failed to update contact');
                });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
