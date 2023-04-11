const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("sekret", 10)
  const user = new User({ username: "root", passwordHash })
  await user.save()
  const res = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" })
  token = res.body.token
})

test("blogs have a unique id property", async () => {
  const blogId = await helper.nonExistingId()
  expect(blogId).toBeDefined()
})

describe("creation of blog posts", () => {
  test("succeeds with valid blog post data", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "FSO",
      url: "fizz.buzz",
      likes: 69,
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).toContainEqual("async/await simplifies making async calls")
  })

  test("succeeds and sets likes to 0 when undefined", async () => {
    const blogWithoutLikes = {
      title: "good title",
      url: "foo.bar",
    }
    await api
      .post("/api/blogs")
      .send(blogWithoutLikes)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const likes = blogsAtEnd[blogsAtEnd.length - 1].likes
    expect(likes).toStrictEqual(0)
  })

  test("fails with 400 Bad Request when title is missing", async () => {
    const blogWithoutTitle = new Blog({ url: "foo.bar" })
    await api.post("/api/blogs").send(blogWithoutTitle).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test("fails with 400 Bad Request when url is missing", async () => {
    const blogWithoutUrl = new Blog({ title: "great title" })
    await api.post("/api/blogs").send(blogWithoutUrl).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe("deletion of blog posts", () => {
  test("succeeds and returns 204 when id is valid", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "FSO",
      url: "fizz.buzz",
      likes: 69,
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[2]
    await api
      .delete(`/api/blogs/${blogsAtStart[2].id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(blogsAtEnd).not.toContain(blogToDelete)
  })

  test("fails and returns 400 when id is invalid", async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api.delete("/api/blogs/invalidId").expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtStart).toStrictEqual(blogsAtEnd)
  })
})

describe("updating of blog posts", () => {
  test("succeeds and returns 204 with valid PUT request body", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updatedBlog = {
      title: "Amazing title",
      author: "Giacomo Leopardi",
      url: "fizz.buzz",
      likes: 1998,
    }
    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtStart).not.toStrictEqual(blogsAtEnd)
    expect(blogsAtEnd[0].title).toStrictEqual(updatedBlog.title)
  })

  test("fails and returns 204 with invalid PUT request body", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const invalidBlog = {
      title: "Lorem ipsum dolor sit amet",
    }
    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(invalidBlog)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtStart[0]).toStrictEqual(blogsAtEnd[0])
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
