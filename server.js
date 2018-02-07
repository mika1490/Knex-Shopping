const express = require('express');
const PORT = process.env.PORT || 3000;
const knex = require('./knex/knex.js');
const app = express();

const cart = require('.routes/cart');
const cart = require('.routes/products')
const cart = require('.routes/users')

app.use('/cart', cart);
app.use('/products', products);
app.use('/users', users);

// app.get('/tasks', (req, res) => {
//   // use the knex variable above to create dynamic queries
// });

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});