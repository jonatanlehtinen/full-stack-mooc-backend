const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-rqgyq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const phoneBook = new PhoneBook({
    name,
    number,
  })

  phoneBook.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('phonebook:')
  PhoneBook.find({})
    .then((persons) => {
      persons.forEach((person) =>
        console.log(person.name + ' ' + person.number)
      )
    })
    .then(() => mongoose.connection.close())
}
