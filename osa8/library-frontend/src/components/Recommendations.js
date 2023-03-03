import { gql, useQuery } from '@apollo/client'

import { ALL_BOOKS } from './Books'

const ME = gql`
  query {
    me {
        username
        favoriteGenre
    }
  }
`


const Recommendations = (props) => {

    const result = useQuery(ALL_BOOKS)
    const me = useQuery(ME)

    if (result.loading)  {
      return <div>loading...</div>
    }


    const genre = me.data.me.favoriteGenre

    const books = result.data.allBooks

    const filteredBooks = books.filter(b => b.genres.includes(genre))

    return (
        <div>
        <h2>Recommendations</h2>
        <h3>Books of your favorite genre</h3>

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
        </div>
    )
}

export default Recommendations