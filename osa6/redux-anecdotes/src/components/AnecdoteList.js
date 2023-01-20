import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'


const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const dispatch = useDispatch()
  
    const sortedAnecdotes = [...anecdotes].sort(function(a, b) {
      if (a.votes < b.votes) return 1
      if (a.votes > b.votes) return -1
    })
  
    const vote = (id) => {
      dispatch(addVote(id))
    }
  
    return (
      <div>
        <h2>Anecdotes</h2>
        {sortedAnecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <form onSubmit={() => vote(anecdote.id)}>
                <button type='submit'>vote</button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

export default AnecdoteList