const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs[0].likes && blogs.length === 1) {
    return blogs[0].likes
  } else if (blogs[0].likes === undefined) {
    return 0
  } else {
    return blogs.map((b) => b.likes).reduce((a, b) => a + b)
  }
}

const favoriteBlog = (blogs) => {
  let max = 0
  blogs.map((b) => {
    if (b.likes > max) max = b.likes
  })
  return blogs.find((b) => b.likes === max)
}

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})
  const authorWithMostBlogs = Object.keys(authors).reduce((a, b) =>
    authors[a] > authors[b] ? a : b
  )
  return { author: authorWithMostBlogs, blogs: authors[authorWithMostBlogs] }
}

const mostLikes = (blogs) => {
  let authorWithMostLikes
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    if (!authorWithMostLikes || acc[blog.author] > acc[authorWithMostLikes]) {
      authorWithMostLikes = blog.author
    }
    return acc
  }, {})
  return { author: authorWithMostLikes, likes: authors[authorWithMostLikes] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
