import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)

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
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter
        search={search}
        setSearch={setSearch}
        persons={persons}
        handleSearchChange={handleSearchChange}
      />
      <h2>Add a new person</h2>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        message={message}
        setMessage={setMessage}
       />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        setPersons={setPersons}
        personsToShow={personsToShow}
        message={message}
        setMessage={setMessage}
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
      return JSON.stringify(props.newName) === JSON.stringify(person.name)
    })

    if (contains) {
      const confirmed = window.confirm(`${props.newName} is already added to phonebook, replace old number with new one?`)
      if (confirmed) {
        const id = parseInt(Object.keys(props.persons).find(person => props.persons[person].name === props.newName))+1
        personService
        .update(id, nameObject)
        .then(response => {
          props.setPersons(props.persons.concat(response.data))
          personService
            .getAll()
            .then(response => {
              props.setPersons(response.data)
            })
          props.setNewName('')
          props.setNewNumber('')
          props.setMessage(`${props.newName}'s number replaced!`)
          setTimeout(() => {
            props.setMessage(null)
          }, 5000)
        }).catch(error => {
          alert('This person was already deleted from the server')
          props.setPersons(props.persons.filter(n => n.id !== id))
        })
      }
    } else {
      personService
      .create(nameObject)
      .then(response => {
        props.setPersons(props.persons.concat(response.data))
        props.setNewName('')
        props.setNewNumber('')
        props.setMessage(`${props.newName} added to phonebook!`)
        setTimeout(() => {
          props.setMessage(null)
        }, 5000)
      }).catch(error => {
        alert(error)
      })
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
  const DeletePerson = (id) => {
    const confirmed = window.confirm('Delete this person?')

    if (confirmed) {
      personService
        .remove(id)
        .then(response => {
          console.log(response.data)
          props.setPersons(props.persons.filter(n => n.id !== id))
          props.setMessage(`Deletion successful!`)
          setTimeout(() => {
            props.setMessage(null)
          }, 5000)
      })}
  
    return 
  }

  return (
    <ul>
      {props.personsToShow.map((person) => 
          <li key={person.name}>{person.name} {person.number} <button onClick={() => DeletePerson(person.id)}>Delete</button></li>)}
    </ul>
  )
}

const Notification = ({ message }) => {
  const Style = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={Style}>
      {message}
    </div>
  )
}

export default App
