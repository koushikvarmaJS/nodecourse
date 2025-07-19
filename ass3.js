// 3.13 through 3.21

const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/info' , (request,response) => {
    Person.countDocuments({}).then(count => {
        const time = new Date()
        response.send(`<h1>Phonebook has info for ${count} people</h1>
        <p>${time}</p>`)
    }).catch(error => {
        response.status(500).send(error,"error retreing data")
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {response.json(persons)})
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'Name or number is missing' })
    }
  
    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });
  
    Person.findOne({ name: newPerson.name }).then(existingName => {
        if (existingName) {
          return response.status(409).json({ error: "Name already exists" })
        }
        return newPerson.save()
      }).then(savedPerson => {
        if (savedPerson) response.json(savedPerson)
      }).catch(error => {
        if (error.name === "ValidationError") {
            console.log(error.message)
          return response.status(409).json({ error: error.message })
        }
        console.error("Unexpected error:", error)
        return response.status(500).json({ error: "Something went wrong" })
      })
})

app.put('/api/persons/:id', (request, response) => {
    const { number } = request.body
    Person.findById(request.params.id).then(person => {
        if (!person) {return response.status(404).end()}
        person.number = number
        return person.save().then((updatedPerson) => {response.json(updatedPerson)})
        }).catch(error =>{
            console.log(error)
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request,response)=>{
    const id = request.params.id
    console.log(id)
    if(!id){
        return response.status(400).json({error: "Missing id"})
    }
    Person.findByIdAndDelete(id).then(deleted => {
        if(deleted){return response.status(204).json("Deleted").end()}
        else{return response.status(404).json("Person Not found")}
    }).catch(error => {
        return response.status(500).json({error: error})
    })
})

// const PORT = 3001
// app.listen(PORT, ()=>{
//     console.log("Server is listening on Port:", PORT)
// })

// 3.12

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://percocets:${password}
@cluster0.mudev3k.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

if(process.argv.length == 3){
    const Person = mongoose.model('Person', phonebookSchema)
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
        console.log(person.name,person.number)
        })
    mongoose.connection.close()
    })
}
else if(process.argv.length == 5){
    const Person = mongoose.model('Person', phonebookSchema)
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    })

    person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to Phonebook`)
    mongoose.connection.close()
    })
}

// 3.1 through 3.9
// 3.10,3.11 are just deployments

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const app = express()
const {persons} = require('./notes')

app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/info', (request,response) => {
  const time = new Date()
  response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
  <p>${time}</p>
  `)
})

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
    // console.log("koushik",Object.keys(request))
    const id = request.params.id
    const person = persons.find(n => n.id === id)
    if(person){response.json(person)}
    else{response.status(404).end()}
})

app.delete('/api/persons' , (request,response) => {
  const {id} = request.body
  console.log("id:",typeof(id),id)
  console.log(persons)
  if(!id){return response.status(400).json("Missing id")}
  const index = persons.findIndex(p => p.id===id)
  console.log("index:",index)
  if(index!==-1){
    persons.splice(index,1)
    return response.status(204).json("deleted").end()
  }else{
    return response.status(404).json({error:'Person not found'})
  }

})

app.post('/api/persons', (request,response) => {
  const newPerson = {
    id: String(Math.floor(Math.random() * 100)),
    name : request.body.name,
    number : request.body.number
  }
  if(!newPerson.name || !newPerson.number){
    return response.status(404).json("no name or number")
  }else{
    const names = persons.map(p => p.name)
    if(names.includes(newPerson.name)){
      return response.status(404).json("Name already exists")
    }else{
      persons.push(newPerson)
      return response.status(200).json(persons)
    }
  }
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log("Server is listening on Port:", PORT)
})

//Morgan

// const morgan = require('morgan')

// morgan.token('body', (req) => {
//     return req.method === 'POST' ? JSON.stringify(req.body) : ''
//   })

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))