import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ msg }) => {
  if (msg === null) {
    return null
  }
  const style = msg.toLowerCase().includes('error') ? "error" : "success"
  return <div className={style}>{msg}</div>
}

const Persons = ({ p, handleDelete }) => {
  return (
    <div>
      {p.map(p =>
        <div key={p.id}>
          <p>{p.name} {p.number}</p>
          <button onClick={() => handleDelete(p, p.id)}>delete</button>
        </div>
      )}
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        <label>
          name: <input
            value={newName}
            onChange={handleNameChange} />
        </label>
      </div>
      <div>
        <label>
          number: <input
            value={newNumber}
            onChange={handleNumberChange} />
        </label>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      <label>
        filter shown for <input
          value={value}
          onChange={onChange} />
      </label>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initPersons => {
        setPersons(initPersons)
      })
  }, [])

  const handleDelete = (person, id) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(res => {
          const newPersons = persons.filter(p => p.id !== person.id)
          setPersons(newPersons)
          setNotification(`Deleted ${person.name} successfully`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          console.log("Status code: ", res.status);
        })
        .catch(e => {
          setNotification(`Error! Information for ${person.name} has already been removed from server`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          console.log(e);
        })
    }
  }

  const personsToShow = showAll
    ? persons
    : persons.filter(p => (p.name.toLowerCase().includes(filter.toLowerCase()) || (p.number.includes(filter))))

  const addPerson = (event) => {
    event.preventDefault()
    const personToAdd = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    const isAlreadyAdded = persons.find(p => p.name === newName)
    if (!isAlreadyAdded) {
      personService
        .create(personToAdd)
        .then(resPerson => {
          setPersons(persons.concat(resPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${resPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(e => {
          console.log(e)
          setNotification(`Error occurred when attempting to add ${resPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })

    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...isAlreadyAdded, number: newNumber }
        personService
          .update(isAlreadyAdded.id, updatedPerson)
          .then(resPerson => {
            setPersons(persons.map(p => p.id !== isAlreadyAdded.id ? p : resPerson))
            setNewName('')
            setNewNumber('')
            setNotification(`Edited ${resPerson.name}'s phone number!`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(e => {
            console.log(e)
            setNotification(`Error when attempting to add new phone number for ${resPerson.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShowAll(false)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification msg={notification} />
      <Filter value={filter} onChange={handleFilterChange} />
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons p={personsToShow} handleDelete={handleDelete} />
    </div >
  )
}

export default App