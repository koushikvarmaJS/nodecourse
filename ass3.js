// 3.1 through 3.8

const express = require('express')
const morgan = require('morgan')
const app = express()
const {persons} = require('./notes')

app.use(express.json())

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