const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();

router
  .get(`/:user_id`, (req, res) => {
    let id = req.params.user_id;

    return knex.raw(`SELECT * FROM users WHERE id = ?`, [id])
      .then(result => {
        if (result.rows.length) {
          return result;
        } else {
          throw new Error(`User Is Not Found`)
        }
      })
      .then(result => {
        return knex.raw(`SELECT products.* FROM cart INNER JOIN products ON cart.products_id = products.id WHERE user_id = ?`, [id])
      })
      .then(result => {
        return res.json(result.rows);
      })
      .catch(err => {
        return res.status(500).json({ message: err.message });
      })
  })
  .post(`/:user_id/:product_id`, (req, res) => {
    let userId = req.params.user_id;
    let productId = req.params.product_id;

    if (!userId || !productId) {
      return res.status(400).json({ message: `Missing User Id or Product Id` })
    }
    return knex.raw(`SELECT * FROM users WHERE id = ?`, [userId])
      .then(result => {
        if (result.rows.length) {
          return result;
        } else {
          throw new Error(`User Is Not Found`)
        }
      })
      .then(result => {
        return knex.raw(`SELECT * FROM products WHERE id = ?`, [productId])
        if (result.rows.length) {
          return result
        } else {
          throw new Error(`Products Do Not Exist`)
        }
      })
      .then(result => {
        return knex.raw(`INSERT INTO cart (user_id, products_id) VALUES (?,?) RETURNING *`, [userId, productId])
      })
      .then(result => {
        return res.json({ Success: `true` });
      })
      .catch(err => {
        return res.status(500).json({ message: err.message });
      })
  });

router.delete(`/:user_id/:product_id`, (req, res) => {
  let userId = req.params.user_id;
  let productId = req.params.product_id;

  return knex.raw(`DELETE FROM cart WHERE user_id = ? AND products_id =?`, [userId, productId])

    .then(result => {
      if (result.rowCount !== 0)
        return res.json({ Success: true })
    })
    .catch(err => {
      return res.status(500).json({ message: err.message });
    })
});


module.exports = router;