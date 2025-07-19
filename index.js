const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {response.json(notes)})
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if (note) {response.json(note)} 
        else {response.status(404).end()}
        }).catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.post('/api/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
      return response.status(400).json({ error: 'content missing' })
    }
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
    note.save().then(savedNote => {
      response.json(savedNote)
    })
  })

app.put('/api/notes/:id', (request, response) => {
    const { content, important } = request.body

    Note.findById(request.params.id).then(note => {
        if (!note) {return response.status(404).end()}

        note.content = content
        note.important = important

        return note.save().then((updatedNote) => {response.json(updatedNote)})
        }).catch(error =>{
            console.log(error)
            response.status(500).end()
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log("Server is listening on Port:", PORT)
})