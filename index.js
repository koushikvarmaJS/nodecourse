const express = require('express')
const cors = require('cors')
const {notes} = require('./notes')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes',(request,response) => {
    response.json(notes)
})

app.get('/api/notes/:id',(request,response) => {
    // console.log("koushik",Object.keys(request))
    const id = request.params.id
    const note = notes.find(n => n.id === id)
    if(note){response.json(note)}
    else{response.status(404).end()}
})

app.post('/api/notes' , (request,response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log("Server is listening on Port:", PORT)
})