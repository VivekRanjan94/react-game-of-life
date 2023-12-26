import React from 'react'
import Game from './Game'

const App = () => {
  return (
    <div className='app'>
      <header>
        <h1>Conway's Game of Life</h1>
      </header>
      <Game />
    </div>
  )
}

export default App
