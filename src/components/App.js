import { useState, useEffect, useRef } from 'react'
import Board from './Board'
import '../scss/styles.scss'

const SIZE = 20

let INITIAL_BOARD = []
for (let i = 0; i < SIZE; i++) {
  INITIAL_BOARD.push([])
  for (let j = 0; j < SIZE; j++) {
    INITIAL_BOARD[i].push({ alive: false })
  }
}

export default function App() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [int, setInt] = useState()
  const [speed, setSpeed] = useState(500)
  const speedRef = useRef()

  function handleClick() {
    if (int) {
      clearInterval(int)
      return setInt(null)
    }
    setInt(
      setInterval(() => {
        setBoard(updateBoard(board))
      }, speed)
    )
  }

  useEffect(() => {
    let count = 0
    board.forEach((row) => {
      row.forEach((element) => {
        if (element.alive) {
          count++
        }
      })
    })

    if (count === 0) {
      clearInterval(int)
      return setInt(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board])

  function handleSpeedChange() {
    setSpeed(speedRef.current.value)
    clearInterval(int)
    setInt(
      setInterval(() => {
        setBoard(updateBoard(board))
      }, speed)
    )
  }

  return (
    <>
      <div className='slider-cont'>
        <label htmlFor='speed'>Speed: {speed}</label>
        <input
          type='range'
          value={speed}
          min='100'
          max='2000'
          onChange={handleSpeedChange}
          ref={speedRef}
        />
      </div>
      <Board board={board} setBoard={setBoard} />
      <button onClick={handleClick}>{int ? 'Stop' : 'Start'}</button>
    </>
  )
}

function exists(i, j) {
  return i < SIZE && i >= 0 && j < SIZE && j >= 0
}

function checkNeighbours(board, i, j) {
  const neighbours = [
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ]

  let count = 0

  neighbours.forEach((n) => {
    let newI = i + n[0]
    let newJ = j + n[1]
    if (exists(newI, newJ) && board[newI][newJ].alive) {
      count++
    }
  })

  return count
}

function updateBoard(board) {
  const newBoard = [...board]
  board.forEach((row, rowIdx) => {
    row.forEach((element, colIdx) => {
      const aliveNeighbours = checkNeighbours(board, rowIdx, colIdx)
      if (element.alive && aliveNeighbours > 3) {
        newBoard[rowIdx][colIdx].alive = false
      }
      if (!element.alive && aliveNeighbours === 3) {
        newBoard[rowIdx][colIdx].alive = true
      }
      if (element.alive && aliveNeighbours < 2) {
        newBoard[rowIdx][colIdx].alive = false
      }
    })
  })

  return newBoard
}
