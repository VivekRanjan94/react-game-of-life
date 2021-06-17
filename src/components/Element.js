import React from 'react'

export default function Element({
  alive,
  rowIndex,
  colIndex,
  setBoard,
  board,
}) {
  function handleClick() {
    const newBoard = [...board]
    newBoard[rowIndex][colIndex].alive = !board[rowIndex][colIndex].alive
    setBoard(newBoard)
  }
  return (
    <div
      className={`element ${alive ? 'alive' : ''}`}
      onClick={handleClick}
    ></div>
  )
}
