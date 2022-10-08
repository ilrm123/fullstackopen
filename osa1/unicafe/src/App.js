import { useState } from 'react'

const Statistics = (props) => {

  if (props.all < 1) {
    return (
      <div>
        <h1>Statistics:</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Statistics:</h1>
        <table>
          <tbody>
            <StatisticLine text="Good" value={props.good} />
            <StatisticLine text="Neutral" value={props.neutral} />
            <StatisticLine text="Bad" value={props.bad} />
            <StatisticLine text="All" value={props.all} />
            <StatisticLine text="Average" value={(props.good*1+props.bad*-1) / props.all}  />
            <StatisticLine text="Positive" value={props.good/props.all*100} />
          </tbody>
        </table>
    </div>
  )
}

const Button = (props) => {

    if ('good' in props) {
    return (
      <div>
        <button onClick={() => {
          props.setGood(props.good + 1);
          props.setAll(props.all + 1);
          }}>
          <p>Good</p>
        </button>
      </div>
    )}

    if ('neutral' in props) {
      return (
        <div>
          <button onClick={() => {
            props.setNeutral(props.neutral + 1);
            props.setAll(props.all + 1);
            }}>
            <p>Neutral</p>
          </button>
        </div>
      )}

      if ('bad' in props) {
        return (
          <div>
            <button onClick={() => {
              props.setBad(props.bad + 1);
              props.setAll(props.all + 1);
              }}>
              <p>Bad</p>
            </button>
          </div>
        )}
}

const StatisticLine = (props) => {
  
  if (props.text == 'Positive') {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value} %</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [all, setAll] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button 
        good={good}
        all={all}
        setGood={setGood}
        setAll={setAll} />
      <Button 
        neutral={neutral}
        all={all}
        setNeutral={setNeutral}
        setAll={setAll} />
      <Button 
        bad={bad}
        all={all}
        setBad={setBad}
        setAll={setAll} />
    <Statistics 
      good={good}
      neutral={neutral}
      bad={bad}
      all={all} />
    </div>
  )
}

export default App