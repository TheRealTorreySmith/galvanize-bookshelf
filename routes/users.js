'use strict';

const express = require('express')
const knex = require('../knex')
const humps = require('humps')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// eslint-disable-next-line new-cap
const router = express.Router()

const emptyEmail = (req, res, next) => {
  if(!req.body.email) {
    res.status(400)
    .type('text/plain')
    .send('Email must not be blank')
  } else {
    next()
  }
}

const emptyPass = (req, res, next) => {
  if(!req.body.password) {
    res.status(400)
    .type('text/plain')
    .send('Password must be at least 8 characters long')
  } else {
    next()
  }
}

const emailExists = (req, res, next) => {
  knex('users')
    .select('users.email')
    .then(data => {
      let array = []
      for (var i = 0; i < data.length; i++) {
        array.push(data[i].email)
      }
      if (array.includes(req.body.email)) {
        res.status(400)
        .type('text/plain')
        .send('Email already exists')
      } else {
        next()
      }
    })
}

const usersPost2 = (req, res, next) => {
  const password = req.body.password
  const payload = req.body.email
  const token = jwt.sign(payload, 'key')
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
              res.cookie('token', `${token}`, { Path: '/', httpOnly: true })
                 .status(200)
                 .json(humps.camelizeKeys(result[0]))
            })
      })
    })
}

const usersPost = (req, res, next) => {
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
            console.log(result)
            res.json(humps.camelizeKeys(result[0]))
          })
    })
  })
}

//POST REQUEST HANDLER
router.post('/', emptyEmail, emptyPass, emailExists, usersPost)

//BONUS POST REQUEST HANDLER
//router.post('/', emptyEmail, emptyPass, emailExists, usersPost, usersPost2)

module.exports = router;
