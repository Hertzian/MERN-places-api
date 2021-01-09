const HttpError = require('../models/http-error')
const { v4 } = require('uuid')
const {validationResult} = require('express-validator')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'User 1',
    email: 'user1@user.com',
    password: '123456',
  },
  // {
  //   id: 'u2',
  //   name: 'User 2',
  //   email: 'user2@user.com',
  //   password: '123456',
  // },
]

// @desc    get place by id
// @route   GET /api/users
// @access  private
exports.getUsers = (req, res, next) => {
  const users = DUMMY_USERS

  res.json(users)
}

// @desc    get place by id
// @route   POST /api/users/signup
// @access  private
exports.signup = (req, res, next) => {
  const errors = validationResult(req)

  if(errors.isEmpty()){
    console.log(errors)
    // res.status(422)
    throw new HttpError('Invalid inputs passed, please check your data', 422)
  }
  const { name, email, password } = req.body

  const user = DUMMY_USERS.find(user => user.email === email)

  if(user){
    throw new HttpError('Email already exists', 422)
  }

  const createdUser = {
    id: v4(),
    name,
    email,
    password,
  }

  DUMMY_USERS.push(createdUser)

  res.status(201).json({ user: createdUser })
}

// @desc    get place by id
// @route   POST /api/users/login
// @access  private
exports.login = (req, res, next) => {
  const { email, password } = req.body

  const user = DUMMY_USERS.find((user) => user.email === email)
  console.log(user)

  if (!user || user.password !== password) {
    throw new HttpError('Invalid credentials', 401)
  }

  res.json({ message: 'logged in', user })
}
