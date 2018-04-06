'use strict';

const express = require('express');
const knex = require('../knex')
const humps = require('humps')
const bcrypt = require('bcrypt');
// eslint-disable-next-line new-cap
const router = express.Router();


router.post('/', (req, res, next) => {
  const password = req.body.password
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hashedPass) {
        knex('users')
          .insert({
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              email: req.body.email,
              hashed_password: hashedPass
          })
          .returning(['id','first_name', 'last_name', 'email'])
            .then((result) => {
              res.json(humps.camelizeKeys(result[0]))
            })
      })
    })
})


module.exports = router;
