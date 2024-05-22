const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const User = require('../models/User');
const Ride = require('../models/Ride');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    rideLogs: {
      type: new GraphQLList(RideType),
      resolve(parent, args) {
        return Ride.find({ user: parent.id });
      }
    }
  })
});

const RideType = new GraphQLObjectType({
  name: 'Ride',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    park: { type: GraphQLString },
    dateRidden: { type: GraphQLString },
    rating: { type: GraphQLInt },
    review: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.user);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      }
    },
    ride: {
      type: RideType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Ride.findById(args.id);
      }
    },
    rides: {
      type: new GraphQLList(RideType),
      resolve(parent, args) {
        return Ride.find({});
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(args.password, salt);
        const user = new User({
          username: args.username,
          email: args.email,
          password: hashedPassword,
        });
        return user.save();
      }
    },
    addRide: {
      type: RideType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        park: { type: new GraphQLNonNull(GraphQLString) },
        dateRidden: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLInt },
        review: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const ride = new Ride({
          name: args.name,
          park: args.park,
          dateRidden: args.dateRidden,
          rating: args.rating,
          review: args.review,
          user: args.userId,
        });
        return ride.save();
      }
    },
    loginUser: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        if (!user) {
          throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) {
          throw new Error('Incorrect password');
        }
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        return token;
      }
    }
  }
});

module.exports = { UserType, RideType, RootQuery, Mutation };
