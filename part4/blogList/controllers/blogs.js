const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  })
  res.json(blogs)
})

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  blog ? res.json(blog) : res.status(404).end()
})

blogsRouter.post("/", userExtractor, async (req, res) => {
  const user = req.user
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user.id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (req, res) => {
  const { title, author, url, likes } = req.body
  const blog = { title, author, url, likes }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    runValidators: true,
    new: true,
    context: "query",
  })
  await updatedBlog.save()
  res.status(204).json(updatedBlog)
})

blogsRouter.delete("/:id", userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(req.params.id)
    return res.status(204).end()
  }
})

module.exports = blogsRouter
