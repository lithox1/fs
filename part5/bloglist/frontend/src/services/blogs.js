import axios from "axios"
const baseUrl = "//localhost:3003/api/blogs"

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then((res) => res.data)
}

const create = (newObject) => {
  const config = { headers: { Authorization: token } }
  const res = axios.post(baseUrl, newObject, config)
  return res.then((res) => res.data)
}

const update = (id, newObject) => {
  const config = { headers: { Authorization: token } }
  const req = axios.put(`${baseUrl}/${id}`, newObject, config)
  return req.then((res) => res.data)
}

export default { getAll, create, update, setToken }
