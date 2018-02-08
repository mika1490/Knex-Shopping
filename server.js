const express = require('express');
const PORT = process.env.PORT || 3000;
const knex = require('./knex/knex.js');
const bodyParser = require('body-parser');

const cart = require('./routes/cart');
const products = require('./routes/products')
const users = require('./routes/users')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cart', cart);
app.use('/products', products);
app.use('/users', users);


// app.get('/tasks', (req, res) => {
//   // use the knex variable above to create dynamic queries
// });

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});