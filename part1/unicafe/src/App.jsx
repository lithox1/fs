import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = (props) => <tr><td>{props.text}</td><td>{props.value}</td></tr>

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  const avg = (good - bad) / total
  const goodPercent = `${(good / total) * 100}%`

  if (total == 0) {
    return <p>No feedback given</p>
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={total} />
          <StatisticLine text='average' value={avg} />
          <StatisticLine text='positive' value={goodPercent} />
        </tbody>
      </table>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedbackClick = (setFeedback, feedback) => () => {
    setFeedback(feedback + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={feedbackClick(setGood, good)} text='good' />
      <Button handleClick={feedbackClick(setNeutral, neutral)} text='neutral' />
      <Button handleClick={feedbackClick(setBad, bad)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App