const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql');

const Contact = require('./models/contacts');

// Define Contact type
const ContactType = new GraphQLObjectType({
    name: 'Contact',
    fields: () => ({
        _id: { type: GraphQLString },
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
                // Logic to retrieve a single contact by firstName
                return context.db.collection('contacts').findOne({ firstName: args.firstName });
            }
        },
        contacts: {
            type: new GraphQLList(ContactType),
            resolve(parent, args, context) {
                // Logic to retrieve all contacts from MongoDB
                return context.db.collection('contacts').find().toArray();
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
                email: { type: new GraphQLNonNull(GraphQLString) },
                favoriteColor: { type: new GraphQLNonNull(GraphQLString) },
                birthday: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args, context) {
                // Logic to add a new contact to the database
                return context.db.collection('contacts').insertOne(args).then(result => result.ops[0]);
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
            resolve(parent, args) {
                // Logic to update a contact in the database
                const { _id, ...updateData } = args;
                return context.db.collection('contacts').findOneAndUpdate(
                    { _id: ObjectId(_id) },
                    { $set: updateData },
                    { returnOriginal: false }
                ).then(result => result.value);
            }
        },
        deleteContact: {
            type: ContactType,
            args: {
                _id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args, context) {
                // Logic to delete a contact from the database
                return context.db.collection('contacts').findOneAndDelete({ _id: ObjectId(args._id) }).then(result => result.value);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
