'use strict'

const express = require('express');
const knex = require('../knex')
const humps = require('humps')
const router = express.Router();
// YOUR CODE HERE
const getBook = (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((book) => {
      res.json(humps.camelizeKeys(book))
    })
    .catch((err) => {
     next(err)
   })
}

const getAllBooks = (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .orderBy('title')
    .then((book) => {
      res.json(humps.camelizeKeys(book)[0])
    })
    .catch((err) => {
     next(err)
   })
}

const newBook = (req, res, next) => {
      knex('books')
        .limit(1)
        .insert(humps.decamelizeKeys({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            coverUrl: req.body.coverUrl
        }))
        .then((result) => {
          res.json(humps.camelizeKeys(result[0]))
        })
      .catch((err) => {
        next(err)
    })
}

const updateBooks = (req, res, next) => {
  knex('books')
    .where('books.id', req.params.id)
    .limit(1)
    .then((data) => {
      if (!data) {
        return next()
      }
      knex('books')
        .update(humps.decamelizeKeys({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          coverUrl: req.body.coverUrl
        }))
        .then((result) => {
          res.json(humps.camelizeKeys(result[0]))
        })
    })
    .catch((err) => {
      next(err)
    })
}

const delBooks = (req, res, next) => {
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
}

// const checkBooks = (req, res, next) => {
//   knex('books')
//     .returning('books.id')
//     .then(data => {
//       let array = []
//           for (var i = 0; i < data.length; i++) {
//             array.push(data[i].id)
//           }
//           if (!array.includes(req.body.id)) {
//             res.status(404)
//               .type('text/plain')
//               .send('Not Found')
//             } else {
//               next()
//             }
//     })
// }

// const checkBookPosts = (req, res, next) => {
//   if (!req.body.title) {
//     res.status(400)
//       .type('text/plain')
//       .send('Title must not be blank')
//   } else if (!req.body.author) {
//     res.status(400)
//       .type('text/plain')
//       .send('Author must not be blank')
//   } else if (!req.body.genre) {
//     res.status(400)
//       .type('text/plain')
//       .send('Genre must not be blank')
//   } else if (!req.body.description) {
//     res.status(400)
//       .type('text/plain')
//       .send('Description must not be blank')
//   } else if (!req.body.coverUrl) {
//     res.status(400)
//       .type('text/plain')
//       .send('Cover URL must not be blank')
//   } else {
//     next()
//   }
// }

//REQUEST HANDLERS
router.get('/', getBook)
router.get('/:id', getAllBooks)
router.post('/', newBook)
router.patch('/:id', updateBooks)
router.delete('/:id', delBooks)

// //BONUS REQEST HANDLERS
// router.get('/', getAllBooks)
// router.get('/:id', getBook)
// router.post('/', checkBookPosts, newBook)
// router.patch('/:id', checkBooks, updateBooks)
// router.delete('/:id', checkBooks, delBooks)

module.exports = router;
