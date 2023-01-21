import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"
import {
  // ...
  useParams
} from "react-router-dom"
import {
  // ...
  useNavigate
} from 'react-router-dom'
import  { useField } from './hooks'


const App = () => {

    const [anecdotes, setAnecdotes] = useState([
      {
        content: 'If it hurts, do it more often',
        author: 'Jez Humble',
        info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
        votes: 0,
        id: 1
      },
      {
        content: 'Premature optimization is the root of all evil',
        author: 'Donald Knuth',
        info: 'http://wiki.c2.com/?PrematureOptimization',
        votes: 0,
        id: 2
      }
    ])
    
    const Menu = (props) => {
      const padding = {
        paddingRight: 5
      }
      return (
        <Router>
          <div>
            <Link style={padding} to="/">anecdotes</Link>
            <Link style={padding} to="/create">create new</Link>
            <Link style={padding} to="/about">about</Link>
          </div>
    
          <Routes>
            <Route path="/" element={<AnecdoteList />} />
            <Route path="anecdotes/:id" element={<Anecdote />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      )
    }

    const Anecdote = () => {
      const id = useParams().id
      const anecdote = anecdotes.find(n => n.id === Number(id))

      return (
        <div>
          <h1>{anecdote.content}</h1>
          has {anecdote.votes} votes.
          <br></br>
          for more info see: <a href={anecdote.info}>{anecdote.info}</a>
        </div>
      )
    }
    
    const AnecdoteList = () => {
    
      const anecdoteById = (id) =>
        anecdotes.find(a => a.id === id)
    
      const vote = (id) => {
        const anecdote = anecdoteById(id)
    
        const voted = {
          ...anecdote,
          votes: anecdote.votes + 1
        }
    
        setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
      }
    
    
      return (
      <div>
        <h2>Anecdotes</h2>
        <ul>
          {anecdotes.map(anecdote => 
            <li key={anecdote.id} ><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
        </ul>
      </div>
    )}
    
    const About = () => (
      <div>
        <h2>About anecdote app</h2>
        <p>According to Wikipedia:</p>
    
        <em>An anecdote is a brief, revealing account of an individual person or an incident.
          Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
          such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
          An anecdote is "a story with a point."</em>
    
        <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
      </div>
    )
    
    const Footer = () => (
      <div>
        Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    
        See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
      </div>
    )
    
    const CreateNew = () => {
      const content = useField('text')
      const author = useField('text')
      const info = useField('text')
      const navigate = useNavigate()
    
      const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))
      }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        addNew({
          content: content.value,
          author: author.value,
          info: info.value,
          votes: 0
        })
        setMessage(`a new anecdote ${content.value} created`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        navigate('/')
      }

    
      return (
        <div>
          <h2>create a new anecdote</h2>
          <form onSubmit={handleSubmit}>
            <div>
              content
              <input name='content' value={content.value} onChange={content.onChange} />
            </div>
            <div>
              author
              <input name='author' value={author.value} onChange={author.onChange} />
            </div>
            <div>
              url for more info
              <input name='info' value={info.value} onChange={info.onChange} />
            </div>
            <button type='submit'>create</button>
            <button type='reset' onClick={() => {
                const c = content.reset; c();
                const a = author.reset; a(); 
                const i = info.reset; i(); 
                return null }}>reset</button>
          </form>
        </div>
      )
    
    }

  const [message, setMessage] = useState(null)

  const Notification = ({ message }) => {
    const Style = {
      color: 'blue',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
  
    if (message === null) {
      return null
    }
  
    return (
      <div style={Style}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Notification message={message} />
      <Menu />
      <Footer />
    </div>
  )
}

export default App
