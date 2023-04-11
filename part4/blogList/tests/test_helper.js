const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
  {
    title: "Lorem ipsum dolor sit amet",
    author: "Marco Rossi",
    url: "foo.bar",
    likes: "42069",
  },
  {
    title: "Second blog",
    author: "Paolo Neri",
    url: "fizz.buzz",
    likes: "1337",
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon", url: "foo.bar" })
  await blog.save()
  await blog.deleteOne()

  return blog.id
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
