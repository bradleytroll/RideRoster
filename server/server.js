const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schemas');

const app = express();
const PORT = process.env.PORT || 4001; // Change port to 4001

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/rideroster', {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error(err);
  });

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
