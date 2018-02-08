const express = require('express');
const router = express.Router();
const knex = require('../knex/knex');

router.get(`/`, (req, res) => {
  return knex.raw(`SELECT * FROM products`)
    .then(result => {
      console.log(result);
      return res.json(result.rows);
    })
})

  .get(`/:product_id`, (req, res) => {
    let id = req.params.product_id;

    return knex.raw(`SELECT * FROM products WHERE id = ?`, [id])
      .then(result => {
        return res.json(result.rows);
      })
      .catch(err => {
        return res.status(400).json({ message: `Product Not Found` });
      })
  })

  .post(`/new`, (req, res) => {
    let { title, description, inventory, price } = req.body;

    if (!title || !description || !inventory || !price) {
      return res.status(400).json({ message: `Must Post All Product Fields` });
    }
    return knex.raw(`INSERT INTO products (title, description, inventory, price) VALUES (?, ?, ?, ?) RETURNING *`, [title, description, inventory, price])
      .then(result => {
        return res.json(result.rows[0]);
      })
      .catch(err => {
        return res.status(500).json({ message: err.message })
      })
  })

  .put(`/:product_id`, (req, res) => {
    let id = req.params.product_id;
    let { title, description, inventory, price } = req.body;

    if (!id) {
      return res.status(400).json({ message: `Missing Id` });
    }
    return knex.raw(`SELECT * FROM products WHERE id = ?`, [id])
    .then(result => {
      if(result.rows.length) {
        return result;
      } else {
        throw new Error(`Product Already Exists`);
      }
    })
    .then(result => {
      return knex.raw(`UPDATE products SET title = ?, description = ?, inventory =?, price = ? WHERE id = ?`, [title, description, inventory, price, id])
    })
    .then(result => {
      return res.json({message: `Product: ${id} Has Been Updated`})
    })
    .catch(err => {
      return res.status(400).json({message: err.message})
    })
  })

  .delete(`/:product_id`, (req, res) => {
    let id = req.params.product_id;
    
    return knex.raw(`SELECT * FROM products WHERE id = ?`, [id])
    .then(result => {
      if(!result.rows.length) {
        throw new Error(`Product Not Found`);
      } else {
        return result;
      }
    })
    .then(result => {
      return knex.raw(`DELETE FROM products WHERE id = ?`, [result.rows[0].id])
    })
    .then(result => {
      res.json({message: `Product Id: ${id} Successfully Deleted`})
    })
    .catch(err => {
      return res.status(500).json({ message: err.message })
    })
  })



module.exports = router;