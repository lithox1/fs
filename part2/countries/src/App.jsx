import { useEffect, useState } from 'react'
import countriesService from './services/countries'

const Filter = ({ onChange }) => {
  return (
    <label>
      find countries <input
        type='text'
        onChange={onChange} />
    </label>
  )
}

const CountryList = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length > 1) {
    return (
      countries.map(c => <div key={c.name.common}>{c.name.common} <button onClick={() => showCountry(c)}>show</button></div>
      ))
  }
}

const ShowCountry = ({ countries }) => {
  if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <p>capital {countries[0].capital}</p>
        <p>area {countries[0].area}</p>
        <br />
        <h2>languages:</h2>
        <ul>
          {Object.values(countries[0].languages).map((lang, index) =>
            <li key={index}>{lang}</li>)}
        </ul>
        <img src={`${countries[0].flags.png}`} alt={`${countries[0].flags.alt}`} />
      </div>
    )
  }
}

const ShowWeather = ({ weather, countries }) => {
  if (countries.length === 1 && weather !== null) {
    return (
      <div>
        <h2>Weather in {countries[0].capital}</h2>
        <p>temperature {weather.temp} Celsius</p>
        <img src={weather.icon.src} alt={weather.icon.description} />
        <p>wind {weather.wind} m/s</p>
      </div>
    )
  } else if (countries.length === 1) {
    return <div><p>Weather data currently unavailable.</p></div>
  }
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState()
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initCountries => {
        setCountries(initCountries)
      })
      .catch(e => {
        console.log(e);
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = filter
    ? countries.filter(c => c.name.common.toLowerCase().includes(filter.toLowerCase()))
    : []

  const handleShowButton = (c) => {
    setFilter(c.name.common)
  }

  useEffect(() => {
    if (filteredCountries.length === 1)
      countriesService
        .getWeather(filteredCountries[0].latlng)
        .then(res => {
          setWeather({
            "temp": res.main.temp,
            "wind": res.wind.speed,
            "icon": {
              "src": `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`,
              "description": res.weather[0].description
            }
          })
        })
  }, [filter])

  return (
    <>
      <Filter onChange={handleFilterChange} />
      <CountryList countries={filteredCountries} showCountry={handleShowButton} />
      <ShowCountry countries={filteredCountries} />
      <ShowWeather countries={filteredCountries} weather={weather} />
    </>
  )
}

export default App
