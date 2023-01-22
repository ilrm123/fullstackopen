import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
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


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('LoggedBlogAppUser')))
  const [formOpened, setFormOpened] = useState(false)

  const sortedBlogs = [...blogs].sort(function(a, b) {
    if (a.likes < b.likes) return 1
    if (a.likes > b.likes) return -1
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'LoggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessage('Invalid username or password!')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      user: user.id
    }

    window.localStorage.setItem(
      'LoggedBlogAppUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })

    setMessage('New blog added!')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    setFormOpened(false)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleBlogFormButton = () => {
    if (formOpened === false) {
      setFormOpened(true)
    } else {
      setFormOpened(false)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h3>Login: </h3>
        Username: <input
          id="username"
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
      Password: <input
          id="password"
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">Login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      Title: <input
        id="title"
        value={newTitle}
        onChange={handleTitleChange}
      />
      Author: <input
        id="author"
        value={newAuthor}
        onChange={handleAuthorChange}
      />
      Url :<input
        id="url"
        value={newUrl}
        onChange={handleUrlChange}
      />
      <button type="submit">Add blog</button>
      <button onClick={handleBlogFormButton}>Cancel</button>
    </form>
  )

  const Notification = ({ message }) => {
    const Style = {
      color: 'black',
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

  const BlogList = () => (
    <div>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const UserList = () => {
    let users = blogs.map(blog => blog.user)
    let uniqueUsers = []
    let userBlogs = []
    users.forEach(user => {
      if (!uniqueUsers.includes(user.username)) {
        uniqueUsers.push(user.username)
        userBlogs.push({user: user.username, blogs: 1})
      } else {
        let u = userBlogs.find(n => n.user === user.username)
        u.blogs = u.blogs + 1
      }
    })
  
    return (
      <div>
        <h3>List of users and amount of blogs created:</h3>
        {userBlogs.map(blog =>
          <div><Link to={`/users/${users.find(n => n.username === blog.user).id}`}>{blog.user}</Link>: Has created {blog.blogs} blogs</div>
        )}
      </div>
    )
  }

  const UserView = () => {
    const id = useParams().id
    const userBlogs = blogs.filter(blog => blog.user.id === id)
    const users = blogs.map(blog => blog.user)
    const user = users.find(n => n.id === id)
    if (!user) {
      return null
    }
    

    return (
      <div>
        <h3>{user.username}</h3>
        <h4>Added blogs:</h4>
        {userBlogs.map(blog =>
          <div><li>{blog.title}</li></div>
        )}
      </div>
    )
  }

  const BlogView = () => {
    const id = useParams().id
    const blog = blogs.find(n => n.id === id)
    console.log(blog)
    if (!blog) {
      return null
    }

    const handleLike = () => {
      blogService.like(blog)
    }

    return (
      <div>
        <h1>{blog.title}</h1>
        <h4>Url: {blog.url}</h4>
        <h4>{blog.likes} likes</h4>
        <button onClick={handleLike}>Like</button>
        <h4>Added by {blog.user.username}</h4>
      </div>
    )
  }

  const Navigation = () => {
    const padding = {
      paddingRight: 30,
      paddingLeft: 15
    }

    const Style = {
      color: 'purple',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 3,
      padding: 1,
      marginBottom: 3
    }

    return (
      <Router>
      <div style={Style}>
        <h3>
          <Link style={padding} to="/">All blogs</Link>
          <Link style={padding} to="/users">Users</Link>
          <button onClick={handleLogout}>Log out</button>
        </h3>
      </div>

      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </Router>
    )
  }

  return (
    <div>
      <h1>Blogs site for cool blogs</h1>

      <Notification message={message} />

      {user === null ?
        loginForm() :
        <div>
          <div><p>Logged in as {JSON.parse(window.localStorage.getItem('LoggedBlogAppUser')).username}</p></div>
          <Navigation />
          <br></br>
          <button onClick={handleBlogFormButton}>Create new blog</button>

          {formOpened === false
            ? <div></div> : blogForm()
          }

        </div>
      }

    </div>
  )
}

export default App
