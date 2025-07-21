const url = process.env.MONGODB_URI
const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]
const name = process.argv[2]
const number = process.argv[3]


console.log('connecting to', url)
mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(result =>{
        console.log('Connected to database', result)
    }).catch(err =>{
        console.log('failed to connect to database', err)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v
    }
})


const Person = mongoose.model('Person', personSchema)

// if (process.argv.length === 2) {
//     Person.find({}).then(result => {
//         console.log("phonebook:")
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//     })
// } else{
//     const person = new Person({
//         name: name,
//         number: number,
//     })
//
//     person.save().then(result => {
//         console.log('person saved!')
//         mongoose.connection.close()
//     })
//
// }


module.exports = mongoose.model("Person", Person)