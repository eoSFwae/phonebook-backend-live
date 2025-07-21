require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Person = require('./models/phonebook')



morgan.token('body',(req,res)=>{return JSON.stringify(req.body)})

app.use(express.static('dist'));
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const generateId = ()=>{
    return Math.floor(Math.random() * 95955);
}

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(err => {
        next(err);
    })
})

app.get('/api/info', (request, response, next) => {
    Person.countDocuments({}).then(count => {
        const date = new Date();
        response.set('content-type', 'text/html');
        response.send(
            `<p>Phonebook has info for ${count} people</p>
               <p>${date}</p>
    `);
    }).catch(err => {
        next(err);
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {response.json(person)}
        else{response.status(404).end()}
    }).catch(error => {
        // console.log(error)
        // response.status(400).json({ error: 'malformatted id' })
        next(error);
    })

})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(person => {
        response.status(204).end()
    })
        .catch(e => {
            next(e);
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body
    const updatePerson = {
        name:body.name,
        number:body.number
    }
    Person.findByIdAndUpdate(id, updatePerson ,{new:true})
        .then(person => {
            if (person) {response.json(person)}
        }).catch(err => {
            next(err);
    })
})

app.post('/api/persons', (request, response,next) => {
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
    }).catch(err => {
        next(err);
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'DocumentNotFoundError') {
        return response.status(404).json({ error: 'document not found' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Listening on port ${PORT}!`)