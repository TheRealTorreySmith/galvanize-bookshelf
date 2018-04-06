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

//FUNCTION THAT CONFIRMS EMAIL
const checkEmail = (req,res,next) => {
  knex('users')
    .select('id','first_name','last_name','email', 'hashed_password')
    .then((result) => {
      user = result
      let email = result[0].email
      if (req.body.email !== email){
        res.status(400)
           .type('text/plain')
           .send('Bad email or password')
      } else {
        next()
      }
    })
}

//FUNCTION THAT CONFIRMS PASSWORD
const checkPass = (req,res,next) => {
  const password = req.body.password
  const hashed_password = user[0].hashed_password
  bcrypt.compare(password, hashed_password, (error, response) => {
    if (response !== true) {
      res.status(400)
      .type('text/plain')
      .send('Bad email or password')
    } else {
      next()
    }
  })
}

//GET TOKEN
router.get('/', (req, res, next) => {
  if (!req.cookies.token) {
    res.status(200).json(false)
  } else if (req.cookies.token) {
    res.status(200).json(true)
  } else {
    next()
  }
})

//POST TOKEN USING JWT
router.post('/', checkEmail, checkPass, (req, res, next) => {
  const payload = req.body.email
  const token = jwt.sign(payload, 'key')
  res.cookie('token', `${token}`, { Path: '/', httpOnly: true })
     .status(200)
     .json({
       id: user[0].id,
       firstName: user[0].first_name,
       lastName: user[0].last_name,
       email: user[0].email
     })
})

//DELETE TOKEN
router.delete('/', (req, res, next) => {
  const { email, password } = req.body
  knex('users')
      .then((result) => {
        res.cookie('token', '', { Path: '/', httpOnly: true })
           .status(200)
           .json(humps.camelizeKeys(result[0]))
      })
})

module.exports = router;
