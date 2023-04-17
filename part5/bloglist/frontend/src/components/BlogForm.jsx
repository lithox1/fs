import { useState } from "react"

const BlogForm = ({ blogs, setBlogs, setMessage, createBlog }) => {
  const emptyBlog = { title: "", author: "", url: "" }
  const [blog, setBlog] = useState(emptyBlog)

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
    })
    setBlog(emptyBlog)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBlog({ ...blog, [name]: value })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title{" "}
        <input value={blog.title} onChange={handleInputChange} name="title" />
        <br />
        author{" "}
        <input value={blog.author} onChange={handleInputChange} name="author" />
        <br />
        url <input value={blog.url} onChange={handleInputChange} name="url" />
        <br />
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
