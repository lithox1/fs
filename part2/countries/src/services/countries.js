import axios from 'axios'

const countriesUrl = 'https://restcountries.com/v3.1/all'

const getAll = () => {
    const request = axios.get(countriesUrl)
    return request.then(res => res.data)
}

const getWeather = (coord) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coord[0]}&lon=${coord[1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
    const request = axios.get(weatherUrl)
    return request.then(res => res.data)
}

export default { getAll, getWeather } 