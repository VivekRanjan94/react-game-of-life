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

export default function Game() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [int, setInt] = useState()
  const [speed, setSpeed] = useState(4)
  const speedRef = useRef()

  function handleStartStop() {
    if (int) {
      clearInterval(int)
      return setInt(null)
    }
    setInt(
      setInterval(() => {
        setBoard(updatedBoard(board))
      }, 1000 / speed)
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
        setBoard(updatedBoard(board))
      }, 1000 / speed)
    )
  }

  const handleClear = () => {
    handleStartStop()

    setBoard((prevBoard) => {
      return prevBoard.map((row) => {
        return row.map((element) => {
          return { ...element, alive: false }
        })
      })
    })
  }

  return (
    <div className='game'>
      <div className='left'>
        <Board board={board} setBoard={setBoard} />
      </div>
      <div className='right'>
        <div className='slider-cont'>
          <label className='speed-label' htmlFor='speed'>
            {String(speed).padStart(2, '0')} Updates/Second
          </label>
          <input
            className='speed'
            type='range'
            value={speed}
            min={1}
            max={20}
            onChange={handleSpeedChange}
            ref={speedRef}
          />
        </div>
        <div className='buttons'>
          <button className='button' onClick={handleStartStop}>
            {int ? 'Stop' : 'Start'}
          </button>
          <button className='button' onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
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

function updatedBoard(board) {
  const newBoard = [...board]
  board.forEach((row, rowIdx) => {
    row.forEach((element, colIdx) => {
      const aliveNeighbours = checkNeighbours(board, rowIdx, colIdx)
      // Underpopulation
      if (element.alive && aliveNeighbours < 2) {
        newBoard[rowIdx][colIdx].alive = false
      }
      // Live to the next generation
      if (element.alive && (aliveNeighbours === 3 || aliveNeighbours === 2)) {
        newBoard[rowIdx][colIdx].alive = true
      }
      // Overpopulation
      if (element.alive && aliveNeighbours > 3) {
        newBoard[rowIdx][colIdx].alive = false
      }
      // Reproduction
      if (!element.alive && aliveNeighbours === 3) {
        newBoard[rowIdx][colIdx].alive = true
      }
    })
  })

  return newBoard
}
