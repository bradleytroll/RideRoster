const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const User = require('../models/User');
const Ride = require('../models/Ride');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to validate date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

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
    recentlyRatedRides: {
      type: new GraphQLList(RideType),
      resolve(parent, args) {
        return Ride.find({}).sort({ dateRidden: -1 }).limit(20);
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
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(args.password, salt);
          const user = new User({
            username: args.username,
            email: args.email,
            password: hashedPassword,
          });
          return await user.save();
        } catch (err) {
          if (err.code === 11000) {
            throw new Error('Username or email already exists');
          }
          throw err;
        }
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
        if (!isValidDate(args.dateRidden)) {
          throw new Error('Invalid date format');
        }
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
    deleteRide: {
      type: RideType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const ride = await Ride.findByIdAndDelete(args.id);
        if (!ride) {
          throw new Error('Ride not found');
        }
        return ride;
      }
    },
    updateRide: {
      type: RideType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        park: { type: new GraphQLNonNull(GraphQLString) },
        dateRidden: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLInt },
        review: { type: GraphQLString },
      },
      async resolve(parent, args) {
        if (!isValidDate(args.dateRidden)) {
          throw new Error('Invalid date format');
        }
        const ride = await Ride.findById(args.id);
        if (!ride) {
          throw new Error('Ride not found');
        }
        ride.name = args.name;
        ride.park = args.park;
        ride.dateRidden = args.dateRidden;
        ride.rating = args.rating;
        ride.review = args.review;
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
