'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const knex = require('../knex')
const humps = require('humps')

// eslint-disable-next-line new-cap
const router = express.Router();
// YOUR CODE HERE

router.use(bodyParser.json());




router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then(book => {
      res.json(humps.camelizeKeys(book))
    })
})
module.exports = router;
