const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())

morgan.token('ob', function (req, res) { 
    console.log("ob", req.body)
    return `${JSON.stringify(req.body)}` })

app.use(morgan(':method :url :status :response-time :req[header] :ob'))

let info = {msg: "Phone Book has info for notes.lepeople.", date: new Date(),}

           
let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(notes)
  })

  app.get('/api/info', (request, response) => {
    const nowDate = new Date();
    response.send(`<p>Phone book has info for ${notes.length} people </p> <p>${nowDate.toUTCString()}</p>`)
  })

  app.get('/api/persons/:id', (req, res) =>{
    const id = req.params.id
    const person =  notes.find(person => {return person.id == id})
    console.log(person)

    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(person => person.id != id)
  res.status(204).end()
})

const generateId = () =>{
  const maxID = notes.length > 0
  ? Math.max( ...notes.map(n => n.id))
  : 0
  return maxID +1
}


app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if(notes.some(person => person.name === body.name)){
    return response.status(400).json({ 
        error: 'name must be unique' 
      })

}

  let person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  notes = notes.concat(person)

  response.json(person)
})


  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })