import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.includes(search))

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        search={search}
        setSearch={setSearch}
        persons={persons}
        handleSearchChange={handleSearchChange}
      />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
       />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        personsToShow={personsToShow}
      />
    </div>
  )

}

const PersonForm = (props) => {
  
  const addNameNumber = (event) => {
    event.preventDefault()
    const nameObject = {
      name: props.newName,
      number: props.newNumber,
    }
    
    const contains = props.persons.some(person => {
      return JSON.stringify({name: props.newName}) === JSON.stringify(person)
    })

    if (contains) {
      alert(`${props.newName} is already added to phonebook`)
    } else {
      props.setPersons(props.persons.concat(nameObject))
      props.setNewName('')
      props.setNewNumber('')
    }
  }

  return (
    <form onSubmit={addNameNumber}>
    name: <input
      value={props.newName}
      onChange={props.handleNameChange}
    />
    <br></br>
    number: <input
      value={props.newNumber}
      onChange={props.handleNumberChange}
    />
    <button type="submit">add</button>
  </form>
  )
}

const Filter = (props) => {

  return (
    <form>
    filter shown with: <input
      value={props.search}
      onChange={props.handleSearchChange}
    />
  </form>
  )
}

const Persons = (props) => {

  return (
    <ul>
      {props.personsToShow.map(person => 
          <li key={person.name}>{person.name} {person.number}</li>)}
    </ul>
  )
}

export default App
