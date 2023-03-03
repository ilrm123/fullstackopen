import { useState } from 'react'
import { gql, useApolloClient, useSubscription } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'

import { ALL_BOOKS } from './components/Books'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    author {
      name
      born
    }
    genres
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('user-token'))
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      window.alert('A new book has just been added!')

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(data.data.bookAdded),
        }
      })
    }
  })



  if (token != null) {
    if (page === 'authors') {
      return (
        <div>
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={() => logout()}>log out</button>
          </div>

          <Authors show={page === 'authors'} />
        </div>
    )} else if (page === 'books') {
      return (
        <div>
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={() => logout()}>log out</button>
          </div>
    
          <Books show={page === 'books'} />
        </div>
    )} else if (page === 'recommendations') {
      return (
        <div>
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={() => logout()}>log out</button>
          </div>
    
          <Recommendations show={page === 'recommendations'} />
        </div>
    )} else if (page === 'add') {
      return (
        <div>
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={() => logout()}>log out</button>
          </div>
    
          <NewBook show={page === 'books'} />
        </div>
    )}} else {
      if (page === 'authors') {
        return (
          <div>
            <div>
              <button onClick={() => setPage('authors')}>authors</button>
              <button onClick={() => setPage('books')}>books</button>
              <button onClick={() => setPage('login')}>log in</button>
            </div>
  
            <Authors show={page === 'authors'} />
          </div>
      )} else if (page === 'books') {
        return (
          <div>
            <div>
              <button onClick={() => setPage('authors')}>authors</button>
              <button onClick={() => setPage('books')}>books</button>
              <button onClick={() => setPage('login')}>log in</button>
            </div>
      
            <Books show={page === 'books'} />
          </div>
      )} else if (page === 'login') {
        return (
          <div>
            <div>
              <button onClick={() => setPage('authors')}>authors</button>
              <button onClick={() => setPage('books')}>books</button>
              <button onClick={() => setPage('login')}>log in</button>
            </div>
      
            <Login show={page === 'login'} setToken={setToken} />
          </div>
      )}
    }
}

export default App
