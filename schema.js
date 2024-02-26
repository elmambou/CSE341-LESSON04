const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLID
  } = require('graphql');

const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB package
const Contact = require('./models/contacts'); // Adjust the import path as per your project structure

// Define Contact type
const ContactType = new GraphQLObjectType({
    name: 'Contact',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        favoriteColor: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLString) }
    })
});

// Define Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        contacts: {
            type: new GraphQLList(ContactType),
            resolve: async (_, args, context) => {
                try {
                    // Logic to retrieve all contacts from MongoDB
                    return await Contact.find();
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        },
        contact: {
            type: ContactType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_, args, context) => {
                try {
                    // Logic to retrieve a single contact by ID from MongoDB
                    return await Contact.findById(args.id);
                } catch (err) {
                    throw new Error(err.message);
                }
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
                input: { type: new GraphQLNonNull(ContactInputType) }
            },
            resolve: async (_, { input }, context) => {
                try {
                    // Logic to add a new contact to the database
                    return await Contact.create(input);
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        },
        updateContact: {
            type: ContactType,
            args: {
                input: { type: new GraphQLNonNull(ContactInputType) }
            },
            resolve: async (_, { input }, context) => {
                try {
                    const { _id, ...updateFields } = input;
                    // Convert the _id argument to ObjectId
                    const objectId = new ObjectId(_id);
                    // Logic to update an existing contact in the database
                    await Contact.updateOne({ _id: objectId }, { $set: updateFields });
                    return await Contact.findById(objectId);
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        }
    }
});

// Define Contact input type
const ContactInputType = new GraphQLInputObjectType({
    name: 'ContactInput',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        favoriteColor: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLString) }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
