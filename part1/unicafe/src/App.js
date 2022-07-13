import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  const average = all > 0 ? (good - bad) / all : 0;
  const positive = all > 0 ? Math.round((good / all) * 100) : 0;

  const goodClick = () => {
    setGood(good + 1);
  }

  const neutralClick = () => {
    setNeutral(neutral + 1);
  }

  const badClick = () => {
    setBad(bad + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={goodClick} text="good" />
        <Button handleClick={neutralClick} text="neutral" />
        <Button handleClick={badClick} text="bad" />
      </div>
      <h1>statistics</h1>
      {all > 0 ?
        <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
        : <p>No feedback given</p>}
    </div>
  )
}

export default App;