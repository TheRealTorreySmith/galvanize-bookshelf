'use strict';

const express = require('express');
const knex = require('../knex')
const humps = require('humps')
const jwt = require('jsonwebtoken')
// eslint-disable-next-line new-cap
const router = express.Router();

//FUNCTIONS FOR REQUESTS
const tokenCheck = (req, res, next) => {
  if (req.cookies.token === undefined) {
    res.status(401)
    .type('text/plain')
    .send('Unauthorized')
  } else {
    next()
  }
}

const allFavs = (req, res, next) => {
  knex('favorites')
    .join('books', 'books.id', 'favorites.book_id')
    .then(data => {
      res.json(humps.camelizeKeys(data))
    })
}

const favId = (req, res, next) => {
  knex('favorites')
    .join('books', 'books.id', 'favorites.book_id')
    .then(data => {
      if(req.query.bookId == data[0].book_id) {
        res.json(true)
      } else {
        res.json(false)
      }
    })
}

const setFav = (req, res, next) => {
  const email = jwt.decode(req.cookies.token)
    knex('users')
      .then(allUsers => {
        const userMatch = allUsers.filter(x => x.email == email)
        if (userMatch[0] !== undefined) {
          knex('favorites')
            .insert({
              book_id: req.body.bookId,
              user_id: userMatch[0].id
            })
            .returning(['id','book_id', 'user_id'])
              .then((result) => {
                res.json(humps.camelizeKeys(result[0]))
              })
        }
      })
}

const delFav = (req, res, next) => {
  knex('users')
    .then(allUsers => {
      knex('favorites')
          .del()
          .where('book_id', req.body.bookId)
          .then((result) => {
            res.status(200)
               .json({
                 bookId: req.body.bookId,
                 userId: allUsers[0].id
               })
          })
    })
}

//REQEST HANDLERS
router.get('/', tokenCheck, allFavs)
router.get('/check?', tokenCheck, favId)
router.post('/', tokenCheck, setFav)
router.delete('/', tokenCheck, delFav)

module.exports = router;
