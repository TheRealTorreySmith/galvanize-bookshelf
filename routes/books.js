'use strict';

const express = require('express');
const knex = require('../knex')
const humps = require('humps')
const router = express.Router();
// YOUR CODE HERE

router.get('/', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((book) => {
      res.json(humps.camelizeKeys(book))
    })
    .catch((err) => {
     next(err)
   })
})

router.get('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .orderBy('title')
    .then((book) => {
      res.json(humps.camelizeKeys(book)[0])
    })
    .catch((err) => {
     next(err)
   })
})

router.post('/', (req, res, next) => {
      knex('books')
        .limit(1)
        .insert(humps.decamelizeKeys({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            coverUrl: req.body.coverUrl
        }))
        .returning('*')
        .then((result) => {
          res.json(humps.camelizeKeys(result[0]))
        })
      .catch((err) => {
        next(err)
    })
})

router.patch('/:id', (req, res, next) => {
      knex('books')
        .where('id', req.params.id)
        .limit(1)
        .then((data) => {
          if(!data) return next()
          knex('books')
          .update(humps.decamelizeKeys({
              title: req.body.title,
              author: req.body.author,
              genre: req.body.genre,
              description: req.body.description,
              coverUrl: req.body.coverUrl
          }))
          .returning('*')
          .then((result) => {
            res.json(humps.camelizeKeys(result[0]))
          })
        })
        .catch((err) => {
          next(err)
        })
    })

router.delete('/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if(!row) return next()
      knex('books')
        .del()
        .where('id', req.params.id)
        .then(() => {
        res.json({
          title: row.title,
          author: row.author,
          genre: row.genre,
          description: row.description,
          coverUrl: row.cover_url
        })
      })
      .catch((err) => {
        next(err)
      })
    })
})

module.exports = router;
