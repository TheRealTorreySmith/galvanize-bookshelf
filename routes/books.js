'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const knex = require('../knex')
const humps = require('humps')

// eslint-disable-next-line new-cap
const router = express.Router();
// YOUR CODE HERE

router.use(bodyParser.json());

router.get('/books/:id', (req, res, next) => {
  const { id } = req.params
  knex('books')
    .orderBy('title')
    .where('id', id)
    .then(book => {
      res.json(humps.camelizeKeys(book)[0])
    })
})

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then(book => {
      res.json(humps.camelizeKeys(book))
    })
})

router.post('/books', (req, res, next) => {
      knex('books')
        .insert(humps.decamelizeKeys(req.body))
        .insert(req.body['id'] = 9)
        .then(book => {
        res.status(200).json(humps.camelizeKeys(req.body))
    })
})

router.patch('/books/:id', (req, res, next) => {

    //   knex('books')
    //     .insert(humps.decamelizeKeys(req.body))
    //     .insert(req.body['id'] = 1)
    //     .then(book => {
    //     res.status(200).json(humps.camelizeKeys(req.body))
    // })

    req.body['id'] = req.params.id
    res.status(200).json(req.body)
})

router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .select('author', 'cover_url', 'description', 'genre', 'title')
    .then(book => {
      res.json(humps.camelizeKeys(book)[0])
    })
})

module.exports = router;
