const config = require("./utils/config")
const { info, error } = require("./utils/logger")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const loginRouter = require("./controllers/login")
const usersRouter = require("./controllers/users")
const blogsRouter = require("./controllers/blogs")
const middleware = require("./utils/middleware")

mongoose.set("strictQuery", false)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => info("Connected to MongoDB"))
  .catch((e) => error("Error connecting to MongoDB: ", e.message))

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use("/api/login", loginRouter)
app.use("/api/users", usersRouter)
app.use("/api/blogs", blogsRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
