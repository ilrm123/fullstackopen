import { useState } from 'react'



const Vote = (props) => {

  return (
    <div>
      <button onClick={() => {
        props.copy[props.selected] += 1
        props.setCopy([...props.copy])
      }}>
        <p>Vote</p>
      </button>
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  
  const points = new Uint8Array(7)
  const [copy, setCopy] = useState([...points])

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {copy[selected]} votes</p>
      <br></br>
      <Vote selected={selected} copy={copy} setCopy={setCopy} />
      <button onClick={() => {
        setSelected(Math.floor(Math.random() * 7))
      }}>
        <p>Next anecdote</p>
      </button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[copy.indexOf(Math.max(...copy))]}</p>
    </div>
  )
}

export default App