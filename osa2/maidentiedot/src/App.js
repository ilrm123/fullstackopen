import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }
  
  useEffect(hook, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const results = countries.filter(country => country.name.common.includes(search))

  return (
    <div>
      <form>
      Find countries: <input
        value={search}
        onChange={handleSearchChange}
      />
      </form>
      <br></br>
      <Countries results={results} setSearch={setSearch}/>
    </div>
  )
}


const Countries = (props) => {

  if (props.results.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
  )} else if (props.results.length === 1) {
    return (
      <div>
        <h1>{props.results[0].name.common}</h1>
        <p>Capital: {props.results[0].capital[0]}</p>
        <p>Area: {props.results[0].area}</p>
        <br></br>
        <p>Languages:</p>
          <ul>
          {Object.values(props.results[0].languages).map(language => 
            <li key={language}>{language}</li>)}
          </ul>
        <img src={Object.values(props.results[0].flags)[0]} alt='flag'/>
      </div>
    )} else {
    const func = (name) => {props.setSearch(name)}
    return (
      <ul>
        {props.results.map(country => 
          <li key={country.name.common}>{country.name.common} <button onClick={() => func(country.name.common)}>show</button></li>)}
      </ul>
    )
  }
}

export default App
