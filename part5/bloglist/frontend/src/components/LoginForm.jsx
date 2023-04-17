import { useState } from "react"
import blogService from "../services/blogs"
import loginService from "../services/login"

const LoginForm = ({ user, setUser, message, setMessage }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (e) {
      setMessage("Error: wrong credentials")
      setTimeout(() => setMessage(null), 5000)
    }
  }
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <h2>Log in to application</h2>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
