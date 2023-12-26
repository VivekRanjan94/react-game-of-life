import React from 'react'
import Element from './Element'

export default function Board({ board, setBoard }) {
  return (
    <div className='board'>
      {board.map((row, rowIndex) => {
        return row.map((element, colIndex) => {
          return (
            <Element
              key={rowIndex + colIndex}
              alive={element.alive}
              rowIndex={rowIndex}
              colIndex={colIndex}
              board={board}
              setBoard={setBoard}
            />
          )
        })
      })}
    </div>
  )
}
