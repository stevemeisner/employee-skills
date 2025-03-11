import React from 'react'
import People from '../components/People.jsx'

const App = () => {
  console.log('App component rendering')
  return (
    <div className="wrapper">
      <People />
    </div>
  )
}

export default App
