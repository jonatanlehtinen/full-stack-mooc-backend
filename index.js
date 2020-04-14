require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const PhoneBook = require('./models/phonebook')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
)

app.get('/api/persons', (req, res, next) => {
  PhoneBook.find({})
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()))
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  PhoneBook.find({})
    .then((persons) => {
      res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  PhoneBook.findById(req.params.id)
    .then((result) => {
      return res.json(result.toJSON())
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  PhoneBook.findByIdAndRemove(req.params.id)
    .then(() => {
      return res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = new PhoneBook(req.body)

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON())
    })
    .catch((error) => next(error))

  // if(!newPerson.name) {
  //   return res.status(400).json({
  //     error: "Name missing"
  //   })
  // } else if(!newPerson.number) {
  //   return res.status(400).json({
  //     error: "Number missing"
  //   })
  // } else if(persons.filter(oldPerson => oldPerson.name === newPerson.name).length > 0) {
  //   return res.status(400).json({
  //     error: "Name must be unique"
  //   })
  // } else {
  //   persons.push(newPerson)
  //   res.status(200).end()
  // }
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  PhoneBook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
