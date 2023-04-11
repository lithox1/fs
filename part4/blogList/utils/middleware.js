const { info, error } = require("./logger")
const config = require("../utils/config")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const requestLogger = (req, res, next) => {
  info("Method: ", req.method)
  info("Path: ", req.path)
  info("Body: ", req.body)
  info("---")
  next()
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, config.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" })
  }
  req.user = await User.findById(decodedToken.id)
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" })
}

const errorHandler = (e, req, res, next) => {
  error(e.message)
  if (e.name === "CastError") {
    return res.status(400).send({ error: "Malformatted ID" })
  } else if (e.name === "ValidationError") {
    return res.status(400).json({ error: e.message })
  } else if (e.message === "InvalidRequest") {
    return res.status(400).json({ error: e.message })
  } else if (e.name === "JsonWebTokenError") {
    return res.status(400).json({ error: e.message })
  } else if (e.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" })
  }
  next(e)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}
