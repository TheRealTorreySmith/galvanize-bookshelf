'use strict';

const express = require('express')
const knex = require('../knex')
const humps = require('humps')
const boom = require('boom');
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

const checkFav = (req, res, next) => {
  knex('favorites')
    .select('favorites.book_id')
    .then(data => {
      let array = []
      for (var i = 0; i < data.length; i++) {
        array.push(data[i].book_id)
      }
        if (!array.includes(req.body.book_id)) {
          res.status(404)
          .type('text/plain')
          .send('Favorite not found')
        } else {
          next()
        }
  })
}

const allFavs = (req, res, next) => {
const email = jwt.decode(req.cookies.token)
knex('users')
  .where('users.email', email)
  .then((result) => {
    const user = result.filter(x => x.email == email)
    knex('favorites')
      .join('books', 'books.id', 'favorites.book_id')
      .where('favorites.user_id', result[0].id)
      .then(data => {
        res.json(humps.camelizeKeys(data))
      })
  })
}

const favId = (req, res) => {
  knex('favorites')
  .where('book_id', req.query.bookId)
    .then(data => {
      if(data.length > 0) {
        res.json(true)
      } else {
        res.json(false)
      }
    })
}

const setFav = (req, res) => {
  const email = jwt.decode(req.cookies.token)
  knex('users')
    .then((allUsers) => {
      const userMatch = allUsers.filter(x => x.email == email)
      if (userMatch[0] !== undefined) {
        knex('favorites')
          .insert({
            book_id: req.body.bookId,
            user_id: userMatch[0].id
          })
          .returning(['id', 'book_id', 'user_id'])
          .then((result) => {
            res.json(humps.camelizeKeys(result[0]))
          })
      }
    })
}

const delFav = (req, res, next) => {
  return knex('favorites')
     .where('book_id', req.body.bookId)
     .del()
     .then(result => {
       res.status(200).json({
         result
       })
     })
}

//REQEST HANDLERS
router.get('/', tokenCheck, allFavs)
router.get('/check', tokenCheck, favId)
router.post('/', tokenCheck, setFav)
router.delete('/', tokenCheck, delFav)

module.exports = router
