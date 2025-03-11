import React from 'react'
// import People from '../components/People'

const App = () => {
  console.log('App component rendering')
  return (
    <div
      className="wrapper"
      style={{
        color: 'white',
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '24px',
      }}>
      <h1>Employee Skills App</h1>
      <p>This is a test to see if basic rendering works.</p>
      {/* <People /> */}
    </div>
  )
}

export default App
