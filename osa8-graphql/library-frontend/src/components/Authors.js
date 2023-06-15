import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'


const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

const CHANGE_BORN = gql`
  mutation changeBorn($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      id
      born
      bookCount
    }
  }
`


const Authors = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setSetBornTo] = useState('')

  const [ changeBorn ] = useMutation(CHANGE_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = async (event) => {
    event.preventDefault()

    changeBorn({ variables: { name, setBornTo } })

    setName('')
    setSetBornTo('')
  }

  const result = useQuery(ALL_AUTHORS)

  if (result.loading)  {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear:</h2>
      <form onSubmit={submit}>
        <div>
            Author:
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
        </div>
        <div>
            Birthyear:
            <input
              value={setBornTo}
              onChange={({ target }) => setSetBornTo(parseInt(target.value))}
            />
        </div>
      <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors
