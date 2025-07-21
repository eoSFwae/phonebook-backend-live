require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Person = require('./models/phonebook')



morgan.token('body',(req,res)=>{return JSON.stringify(req.body)})

app.use(express.static('dist'));
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons =  [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423422"
    }
]

const generateId = ()=>{
    return Math.floor(Math.random() * 95955);
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const date = new Date();
        response.set('content-type', 'text/html');
        response.send(
            `<p>Phonebook has info for ${count} people</p>
               <p>${date}</p>
    `);
    })

})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {response.json(person)}
        else{response.status(404).end()}
    }).catch(error => {
        console.log(error)
        response.status(400).json({ error: 'malformatted id' })
    })

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(person => {
        response.status(204).end()
    })
        .catch(e => {
            response.status(400).json({error: e.message})
        })
})

app.post('/api/persons', (request, response) => {
    // const id = generateId()
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({ error: 'missing required fields' })
    }

    // if(persons.find(person => person.name === body.name)){
    //     return response.status(400).json({ error: 'name must be unique' })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then((savedPerson) => {
        response.json(savedPerson)
    })
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Listening on port ${PORT}!`)