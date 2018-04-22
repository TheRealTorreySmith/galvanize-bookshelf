'use strict';

const express = require('express')
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

const checkId = (req, res, next) => {
  if (Number.isInteger(req.body.bookId) == false) {
    res.status(400)
    .type('text/plain')
    .send('Book ID must be an integer')
  } else {
    next()
  }
}

const checkBook = (req, res, next) => {
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
            .send('Book not found')
          } else {
            next()
          }
    })
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
    .select('users.id')
    .then(allUsers => {
      knex('favorites')
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

// //BONUS REQEST HANDLERS
// router.get('/', tokenCheck, allFavs)
// router.get('/check?', tokenCheck, favId, checkId)
// router.post('/', tokenCheck, checkId, checkBook, setFav)
// router.delete('/', tokenCheck, checkId, checkFav, delFav)

module.exports = router
