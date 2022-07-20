import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import Error from "./components/Error";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setNewFilter] = useState("");
  const [Message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (newName === "") {
      alert("Please provide a name");
      setNewName("");
      setNewNumber("");
    } else if (newNumber === "") {
      alert("Please provide a number");
      setNewName("");
      setNewNumber("");
    } else if (persons.find(p => p.name === newName && p.number !== newNumber)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(p => p.name === newName);

        personService
          .updateNumber(oldPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(pers => pers.id !== oldPerson.id ? pers : returnedPerson));
          })
          .catch(error => {
            setMessage(null);
            setErrorMessage(error.response.statusText);
            setTimeout(() => {setMessage(null)}, 5000);
          });
        setNewName("");
        setNewNumber("");
        setMessage("Number changed");
        setTimeout(() => {setMessage(null)}, 5000);
      }
    } else if (!persons.find(p => p.name === newName && p.number === newNumber)) {
        personService
          .create(newPerson)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson));
            setNewName("");
            setNewNumber("")
          })
          .catch(error => {
            console.log(error);
          });
          
          setMessage(`Added ${newPerson.name}`);
          setTimeout(() => {setMessage(null)}, 5000);
    } else {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      setNewNumber("");
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete '${name}'?`)) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  const personsToShow = filter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={Message} />
      <Error errorMessage={errorMessage} />
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={personsToShow}  handleDelete={handleDelete}/>
    </div>
  )
}

export default App;
