import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
      }
      published
      id
      genres
    }
  }
`

const Books = (props) => {
  const [genre, setGenre] = useState('')

  const result = useQuery(ALL_BOOKS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  const allGenres = result.data.allBooks.map(b => b.genres)

  const uniqueGenres = Array.from(new Set(allGenres.flat()))

  const books = result.data.allBooks
  
  var filteredBooks = books.filter(b => b.genres.includes(genre))
  
  if (genre === '') {
    filteredBooks = books
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((g) => (
        <button onClick={() => setGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setGenre('')}>All genres</button>
    </div>
  )
}

export default Books
