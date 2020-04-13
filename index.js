const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)
  } else {
    res.status(404).end() 
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  
  res.status(204).end() 
})

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 10000)
  const newPerson = {...req.body, id}

  if(!newPerson.name) {
    return res.status(400).json({
      error: "Name missing" 
    })
  } else if(!newPerson.number) {
    return res.status(400).json({
      error: "Number missing" 
    })
  } else if(persons.filter(oldPerson => oldPerson.name === newPerson.name).length > 0) {
    return res.status(400).json({
      error: "Name must be unique" 
    })
  } else {
    persons.push(newPerson)
    res.status(200).end()
  }


})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})