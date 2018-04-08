'use strict'

const express = require('express')
const jwt = require('jsonwebtoken')
const humps = require('humps')
const knex = require('../knex')
const bcrypt = require('bcrypt');
// eslint-disable-next-line new-cap
const router = express.Router()
const key = process.env.JWT_KEY

//USER INFO OBJECT
let user = {}

//FUNCTIONS FOR REQUESTS
const getToken = (req, res, next) => {
  if (!req.cookies.token) {
    res.status(200).json(false)
  } else if (req.cookies.token) {
    res.status(200).json(true)
  } else {
    next()
  }
}

const checkEmail = (req,res,next) => {
  knex('users')
    .select('id','first_name','last_name','email', 'hashed_password')
    .where('email', req.body.email)
    .then((result) => {
      user = result[0]
      if (result[0] === undefined || req.body.email !== user.email){
        res.status(400)
           .type('text/plain')
           .send('Bad email or password')
      } else {
      next()
      }
    })
}

const checkPass = (req,res,next) => {
  knex('users')
    .select('id','first_name','last_name','email','hashed_password')
    .where('email', req.body.email)
    .then((result) => {
      const password = req.body.password
      const hashed_password = user.hashed_password
      bcrypt.compare(password, hashed_password, (error, response) => {
        if (response !== true) {
          res.status(400)
          .type('text/plain')
          .send('Bad email or password')
        } else {
          next()
        }
    })
  })
}

const postToken = (req, res, next) => {
  const payload = req.body.email
  const token = jwt.sign(payload, 'key')
  res.cookie('token', `${token}`, { Path: '/', httpOnly: true })
     .status(200)
     .json({
       id: user.id,
       firstName: user.first_name,
       lastName: user.last_name,
       email: user.email
     })
}

const delToken = (req, res, next) => {
  const { email, password } = req.body
  knex('users')
      // .where('token', res.cookie.token)
      // .del()
      .then((result) => {
        res.cookie('token', '', { Path: '/', httpOnly: true })
           .status(200)
           .json(humps.camelizeKeys(result[0]))
      })
}

//REQUEST HANDLERS
router.get('/', getToken)
router.post('/', checkEmail, checkPass, postToken)
router.delete('/', delToken)

module.exports = router;
