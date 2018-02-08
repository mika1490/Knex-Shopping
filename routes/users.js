const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();

router.get(`/:user_id`, (req, res) => {
  let id = req.params.user_id;

  return knex.raw(`SELECT * FROM users WHERE id = ?`, [id])
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      return res.status(400).json({ message: `User Not Found` });
    })
})

  .post(`/register`, (req, res) => {
  let { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({ message: `Missing Email or Password` });
  }
  email = email.toLowerCase();
  return knex.raw(`SELECT users.email FROM users WHERE users.email = ?`, [email])
    .then(result => {
      if (result.rows.length) {
        throw new Error(`User Already Exists`);
      } else {
        return result
      }
    })
    .then(result => {
      return knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [email, password]);
    })
    .then(result => {
      return res.json(result.rows[0]);
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
})

  .post(`/login`, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!(email && password)) {
      return res.status(400).json({ message: `Missing Email or Password` });
    }
    return knex.raw(`SELECT * FROM users WHERE users.email = ?`, [email])
      .then(result => {
        if (!result.rows.length) {
          throw new Error(`User Does Not Exist`)
        } else if
      (result.rows[0].password !== password) {
          throw new Error(`Incorrect Password`);
        } else {
          return res.json(result.rows[0]);
        }
      })
      .catch(err => {
        return res.status(400).json({ message: err.message })
      })
  })

  .put(`/:user_id/forgot-password`, (req, res) => {
    let id = req.params.user_id;
    let password = req.body.password;

    if (!password) {
      return res.status(400).json({ message: `Missing Password` });
    }
    return knex.raw(`SELECT * FROM users WHERE id = ?`, [id])
      .then(result => {
        if (result.rows.length) {
          return result;
        } else {
          throw new Error(`Password Already Exists`);
        }
      })
      .then(result => {
        return knex.raw(`UPDATE users SET password = ? WHERE id = ?`, [password, id])
          .then(result => {
            return res.json({ message: `New Password Created!` })
          })
          .catch(err => {
            return res.status(400).json({ message: err.message })
          })
      })
  })

  .delete(`/:user_id`, (req, res) => {
    let id = req.params.user_id;

    return knex.raw(`SELECT * FROM users WHERE id = ?`, [id])
      .then(result => {
        if (!result.rows.length) {
          throw new Error( `User Not Found`);
        } else {
          return result;
        }
      }).then(result => {
        return knex.raw(`DELETE FROM users WHERE id = ?`, [result.rows[0].id])
      })
      .then(result => {
        res.json({ message: `User Id: ${id} Successfully Deleted` })
      })
      .catch(err => {
        return res.status(400).json({ message: err.message })
      })
  })







module.exports = router;