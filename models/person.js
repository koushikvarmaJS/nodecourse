require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD
const cluster = process.env.MONGODB_CLUSTER
const database = "phonebook"

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

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
    number: {
      type: String,
      minLength : 8,
      required : true,
      validate : {
        validator : function(v){return /^\d{2,3}-\d+$/.test(v)},
        message: props => 
        `${props.value} is not a valid phone number! Format: XX-XXXXXXX or XXX-XXXXXXXX`
      },
    },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', phonebookSchema)