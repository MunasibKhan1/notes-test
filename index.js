const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

morgan.token('data',(req, res) => JSON.stringify({content: req.body.content, important: req.body.important}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))




let notes = [  
    {    
        id: 1,
         content: "HTML is easy",
         important: true  },

    {    
        id: 2,    
         content: "Browser can execute only JavaScript",    
         important: false  
    },  
    {    
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        important: true  
    },
    {    
        id: 4,    
        content: "Frontend and Backend are both Fullstack",    
        important: true  
    },
    {
        id: 5,
        content: "Javascript is not Java",
        important: false
    }
]

app.get('/', (req, res) => {
    res.send('Hello, world again from')
})

app.get(
    '/api/notes',
    (req, res) => {
        
        res.json(notes)
    }

)

app.get(
    '/api/notes/:id',
    (req, res) => {
        const note = notes.find(note => Number(req.params.id) === note.id)
        if (note) {
            res.json(note)
        }
        else {
            res.statusMessage= 'The Note you are looking for does not exists!'
            res.status(404).end()
            
        }
        
    }
)

app.delete(
    '/api/notes/:id',
    (req, res) => {
        const id = Number(req.params.id)
        notes = notes.filter(note => note.id !== id)

        res.status(204).end()
    }
)
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0

    return maxId + 1
}
app.post(
    '/api/notes',
    (req, res) => {

        const body = req.body
        if (!body.content){
            return res.status(404).json({
                error: "Content Missing" 
            })
        }

        const note = {
            content: body.content,
            important: body.important || false,
            id: generateId()
            
        }

        notes = notes.concat(note)
        
        res.json(note)
    }
)


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on ${PORT}`)
