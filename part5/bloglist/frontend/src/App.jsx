import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import LoginForm from "./components/LoginForm"
import BlogForm from "./components/BlogForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem("loggedUser")
    blogService.setToken("")
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setMessage(
        `new blog "${newBlog.title}" by ${newBlog.author} added successfully`
      )
      setTimeout(() => setMessage(null), 5000)
    } catch (e) {
      setMessage("Error when attempting to create new blog")
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        user={user}
        setUser={setUser}
        message={message}
        setMessage={setMessage}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        blogs={blogs}
        setBlogs={setBlogs}
        setMessage={setMessage}
        createBlog={addBlog}
      />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {user === null && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
        </div>
      )}
      <br />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
