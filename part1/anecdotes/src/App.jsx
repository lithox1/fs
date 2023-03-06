import { useState } from 'react'

const arrayMax = (arr) => {
  let max = 0,
    a = arr.length

  for (let counter = 0; counter < a; counter++) {
    if (arr[counter] > max) {
      max = arr[counter]

    }
  }
  return max
}

const Anecdote = ({ anecdote, votes, text }) => {
  return (
    <div>
      <h1>{text}</h1>
      {anecdote}
      <div>
        has {votes} votes
      </div>
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const App = () => {

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const newVotes = [...votes]

  const randomAnecdote = () => setSelected(Math.floor(Math.random() * Math.floor(anecdotes.length)))

  const addVote = () => {
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const maxVotes = arrayMax(votes)
  const mostVotedAnecdote = anecdotes[votes.indexOf(maxVotes)]

  return (
    <div>
      <Anecdote text='Anecdote of the day' anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={addVote} text='vote' />
      <Button onClick={randomAnecdote} text='next anecdote' />
      <Anecdote text='Anecdote with most votes' anecdote={mostVotedAnecdote} votes={maxVotes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
]

export default App