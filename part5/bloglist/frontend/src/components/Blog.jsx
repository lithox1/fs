import { useState } from "react"

const Blog = ({ blog }) => {
  const [visibleBlog, setVisibleBlog] = useState(false)
  const showWhenVisible = { display: visibleBlog ? "" : "none" }

  const toggleVisibility = () => {
    setVisibleBlog(!visibleBlog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <p>
        {blog.title}
        <button onClick={toggleVisibility}>
          {visibleBlog ? "hide" : "view"}
        </button>
      </p>
      <div style={showWhenVisible}>
        <p>{blog.author}</p>
        <a href={blog.url}>{blog.url}</a>
        <p>
          likes {blog.likes}
          <button>like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog
