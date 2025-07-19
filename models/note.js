require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD
const cluster = process.env.MONGODB_CLUSTER
const database = process.env.MONGODB_DATABASE

const url = `mongodb+srv://${username}:${password}
@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0`

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const noteSchema = new mongoose.Schema({
    content: {
      type: String,
      minLength: 5,
      required: true
    },
    important: Boolean
  })

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)