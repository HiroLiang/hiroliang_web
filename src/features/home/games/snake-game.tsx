import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

import { useMessages } from '@/hooks/use-locale'
import type { SnakeCell, SnakeDirection, SnakeGameState } from '@/features/home/types'

const INITIAL_SPEED_MS = 220
const MIN_SPEED_MS = 90
const SPEED_STEP_MS = 12
const HUD_HEIGHT = 44
const VIEW_PADDING = 16
const MAX_SIMULATION_STEPS = 6
const DIRECTION_VECTORS: Record<SnakeDirection, SnakeCell> = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
}
const OPPOSITE_DIRECTIONS: Record<SnakeDirection, SnakeDirection> = {
  down: 'up',
  left: 'right',
  right: 'left',
  up: 'down',
}

type CanvasLayout = {
  boardLeft: number
  boardSize: number
  boardTop: number
  cellSize: number
  gridCount: number
  height: number
  width: number
}

type SnakeRuntime = {
  accumulatorMs: number
  game: SnakeGameState
  lastFrameMs: number | null
}

function getResponsiveGridCount(boardPixelSize: number) {
  if (boardPixelSize >= 920) {
    return 32
  }

  if (boardPixelSize >= 720) {
    return 28
  }

  if (boardPixelSize >= 540) {
    return 24
  }

  return 20
}

function createStartingSnake(gridCount: number) {
  const centerY = Math.floor(gridCount / 2)
  const headX = Math.max(2, Math.floor(gridCount / 3))

  return [
    { x: headX, y: centerY },
    { x: headX - 1, y: centerY },
    { x: headX - 2, y: centerY },
  ]
}

function createRandomFood(snake: readonly SnakeCell[], gridCount: number) {
  const occupied = new Set(snake.map((cell) => `${cell.x}:${cell.y}`))
  const availableCells: SnakeCell[] = []

  for (let y = 0; y < gridCount; y += 1) {
    for (let x = 0; x < gridCount; x += 1) {
      const key = `${x}:${y}`
      if (!occupied.has(key)) {
        availableCells.push({ x, y })
      }
    }
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)] ?? { x: 0, y: 0 }
}

function createInitialSnakeState(gridCount: number, direction: SnakeDirection = 'right'): SnakeGameState {
  const snake = createStartingSnake(gridCount)

  return {
    direction,
    food: createRandomFood(snake, gridCount),
    gridCount,
    score: 0,
    snake,
    speedMs: INITIAL_SPEED_MS,
    status: 'idle',
  }
}

function isOppositeDirection(next: SnakeDirection, current: SnakeDirection) {
  return OPPOSITE_DIRECTIONS[next] === current
}

function computeLayout(width: number, height: number): CanvasLayout {
  const safeWidth = Math.max(width, 160)
  const safeHeight = Math.max(height, 160)
  const playableHeight = Math.max(safeHeight - HUD_HEIGHT - VIEW_PADDING * 2, 64)
  const maxBoardSize = Math.max(64, Math.floor(Math.min(safeWidth - VIEW_PADDING * 2, playableHeight)))
  const gridCount = getResponsiveGridCount(maxBoardSize)
  const cellSize = Math.max(2, Math.floor(maxBoardSize / gridCount))
  const adjustedBoardSize = cellSize * gridCount

  return {
    boardLeft: Math.floor((safeWidth - adjustedBoardSize) / 2),
    boardSize: adjustedBoardSize,
    boardTop: HUD_HEIGHT + Math.max(VIEW_PADDING, Math.floor((playableHeight - adjustedBoardSize) / 2) + VIEW_PADDING),
    cellSize,
    gridCount,
    height: safeHeight,
    width: safeWidth,
  }
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

function drawSnakeGame(
  context: CanvasRenderingContext2D,
  layout: CanvasLayout,
  game: SnakeGameState,
  highScore: number,
  labels: {
    gameOver: string
    gameOverHint: string
    highScore: string
    score: string
  },
) {
  const { boardLeft, boardSize, boardTop, cellSize, gridCount, height, width } = layout

  context.clearRect(0, 0, width, height)

  const background = context.createLinearGradient(0, 0, 0, height)
  background.addColorStop(0, 'rgba(15, 24, 14, 0.98)')
  background.addColorStop(1, 'rgba(9, 17, 10, 1)')
  context.fillStyle = background
  context.fillRect(0, 0, width, height)

  context.strokeStyle = 'rgba(132, 148, 95, 0.32)'
  context.lineWidth = 1
  drawRoundedRect(context, boardLeft - 8, boardTop - 8, boardSize + 16, boardSize + 16, 18)
  context.stroke()

  context.fillStyle = 'rgba(17, 29, 15, 0.94)'
  drawRoundedRect(context, boardLeft - 8, boardTop - 8, boardSize + 16, boardSize + 16, 18)
  context.fill()

  context.fillStyle = 'rgba(78, 93, 58, 0.2)'
  for (let index = 0; index <= gridCount; index += 1) {
    const offset = index * cellSize
    context.fillRect(boardLeft + offset, boardTop, 1, boardSize)
    context.fillRect(boardLeft, boardTop + offset, boardSize, 1)
  }

  context.fillStyle = '#f56f51'
  context.fillRect(
    boardLeft + game.food.x * cellSize + 2,
    boardTop + game.food.y * cellSize + 2,
    Math.max(2, cellSize - 4),
    Math.max(2, cellSize - 4),
  )

  game.snake.forEach((segment, index) => {
    context.fillStyle = index === 0 ? '#ffd65c' : '#9abf62'
    context.fillRect(
      boardLeft + segment.x * cellSize + 1,
      boardTop + segment.y * cellSize + 1,
      Math.max(2, cellSize - 2),
      Math.max(2, cellSize - 2),
    )
  })

  context.fillStyle = '#cfd9a3'
  context.font = '600 14px var(--font-family-app), monospace'
  context.textBaseline = 'middle'
  context.fillText(`${labels.score} ${game.score}`, VIEW_PADDING, 22)
  context.fillText(`${labels.highScore} ${highScore}`, Math.max(VIEW_PADDING, width - 140), 22)

  if (game.status !== 'game-over') {
    return
  }

  context.fillStyle = 'rgba(4, 9, 5, 0.54)'
  drawRoundedRect(context, boardLeft + cellSize, boardTop + boardSize / 2 - 48, boardSize - cellSize * 2, 96, 18)
  context.fill()

  context.fillStyle = '#ffd65c'
  context.font = '700 20px var(--font-family-app), monospace'
  context.textAlign = 'center'
  context.fillText(labels.gameOver, boardLeft + boardSize / 2, boardTop + boardSize / 2 - 10)

  context.fillStyle = '#cfd9a3'
  context.font = '400 12px var(--font-family-app), monospace'
  context.fillText(labels.gameOverHint, boardLeft + boardSize / 2, boardTop + boardSize / 2 + 18)
  context.textAlign = 'start'
}

export function SnakeGame() {
  const t = useMessages()
  const [layout, setLayout] = useState<CanvasLayout>(() => computeLayout(640, 640))
  const [game, setGame] = useState<SnakeGameState>(() => createInitialSnakeState(layout.gridCount))
  const [highScore, setHighScore] = useState(0)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const runtimeRef = useRef<SnakeRuntime>({
    accumulatorMs: 0,
    game,
    lastFrameMs: null,
  })
  const highScoreRef = useRef(highScore)
  const queuedDirectionRef = useRef<SnakeDirection>(game.direction)

  useEffect(() => {
    runtimeRef.current.game = game
    queuedDirectionRef.current = game.direction
  }, [game])

  useEffect(() => {
    highScoreRef.current = highScore
  }, [highScore])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      setLayout((current) => {
        const nextLayout = computeLayout(entry.contentRect.width, entry.contentRect.height)

        if (current.gridCount !== nextLayout.gridCount) {
          const resetGame = createInitialSnakeState(nextLayout.gridCount)
          runtimeRef.current.game = resetGame
          runtimeRef.current.accumulatorMs = 0
          runtimeRef.current.lastFrameMs = null
          queuedDirectionRef.current = resetGame.direction
          setGame(resetGame)
        }

        return nextLayout
      })
    })

    observer.observe(wrapper)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    setHighScore((current) => Math.max(current, game.score))
  }, [game.score])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvasElement = canvasRef.current
    const runtime = runtimeRef.current
    let frameId = 0

    function stepSimulation(current: SnakeGameState): SnakeGameState {
      if (current.status !== 'running') {
        return current
      }

      const nextDirection = queuedDirectionRef.current
      const vector = DIRECTION_VECTORS[nextDirection]
      const head = current.snake[0]
      const nextHead = {
        x: head.x + vector.x,
        y: head.y + vector.y,
      }

      const hitsWall =
        nextHead.x < 0 ||
        nextHead.x >= current.gridCount ||
        nextHead.y < 0 ||
        nextHead.y >= current.gridCount

      if (hitsWall) {
        return {
          ...current,
          direction: nextDirection,
          status: 'game-over',
        }
      }

      const willEatFood = nextHead.x === current.food.x && nextHead.y === current.food.y
      const nextBody = willEatFood ? current.snake : current.snake.slice(0, -1)
      const hitsSelf = nextBody.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)

      if (hitsSelf) {
        return {
          ...current,
          direction: nextDirection,
          status: 'game-over',
        }
      }

      const nextSnake = [nextHead, ...nextBody]
      const nextScore = willEatFood ? current.score + 1 : current.score

      return {
        direction: nextDirection,
        food: willEatFood ? createRandomFood(nextSnake, current.gridCount) : current.food,
        gridCount: current.gridCount,
        score: nextScore,
        snake: nextSnake,
        speedMs: willEatFood ? Math.max(MIN_SPEED_MS, current.speedMs - SPEED_STEP_MS) : current.speedMs,
        status: 'running',
      }
    }

    function renderFrame() {
      const context = canvasElement.getContext('2d')
      if (!context) {
        return
      }

      const ratio = window.devicePixelRatio || 1
      const targetWidth = Math.floor(layout.width * ratio)
      const targetHeight = Math.floor(layout.height * ratio)

      if (canvasElement.width !== targetWidth || canvasElement.height !== targetHeight) {
        canvasElement.width = targetWidth
        canvasElement.height = targetHeight
        canvasElement.style.width = `${layout.width}px`
        canvasElement.style.height = `${layout.height}px`
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      drawSnakeGame(context, layout, runtimeRef.current.game, highScoreRef.current, {
        gameOver: t.home.panels.games.snake.gameOver,
        gameOverHint: t.home.panels.games.snake.gameOverHint,
        highScore: t.home.panels.games.snake.highScoreLabel,
        score: t.home.panels.games.snake.scoreLabel,
      })
    }

    function tick(timestamp: number) {
      if (runtime.lastFrameMs === null) {
        runtime.lastFrameMs = timestamp
      } else {
        runtime.accumulatorMs += timestamp - runtime.lastFrameMs
        runtime.lastFrameMs = timestamp
      }

      let nextGame = runtime.game
      let stepCount = 0

      while (
        nextGame.status === 'running' &&
        runtime.accumulatorMs >= nextGame.speedMs &&
        stepCount < MAX_SIMULATION_STEPS
      ) {
        runtime.accumulatorMs -= nextGame.speedMs
        nextGame = stepSimulation(nextGame)
        stepCount += 1
      }

      if (stepCount === MAX_SIMULATION_STEPS && nextGame.status === 'running') {
        runtime.accumulatorMs = 0
      }

      if (nextGame !== runtime.game) {
        runtime.game = nextGame
        queuedDirectionRef.current = nextGame.direction
        if (nextGame.score > highScoreRef.current) {
          highScoreRef.current = nextGame.score
          setHighScore(nextGame.score)
        }
        setGame(nextGame)
      }

      renderFrame()
      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
      runtime.lastFrameMs = null
      runtime.accumulatorMs = 0
    }
  }, [
    layout,
    t.home.panels.games.snake.gameOver,
    t.home.panels.games.snake.gameOverHint,
    t.home.panels.games.snake.highScoreLabel,
    t.home.panels.games.snake.scoreLabel,
  ])

  useEffect(() => {
    wrapperRef.current?.focus()
  }, [])

  function startGame(direction: SnakeDirection) {
    const nextGame: SnakeGameState = {
      ...createInitialSnakeState(layout.gridCount, direction),
      direction,
      status: 'running',
    }
    queuedDirectionRef.current = direction
    runtimeRef.current.game = nextGame
    runtimeRef.current.accumulatorMs = 0
    runtimeRef.current.lastFrameMs = null
    setGame(nextGame)
  }

  function queueDirection(nextDirection: SnakeDirection) {
    const current = runtimeRef.current.game
    const currentDirection = current.direction
    const queuedDirection = queuedDirectionRef.current

    if (
      current.status === 'running' &&
      (isOppositeDirection(nextDirection, currentDirection) || isOppositeDirection(nextDirection, queuedDirection))
    ) {
      return
    }

    queuedDirectionRef.current = nextDirection
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const directionByKey: Partial<Record<string, SnakeDirection>> = {
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
    }

    const nextDirection = directionByKey[event.key]
    if (!nextDirection) {
      return
    }

    event.preventDefault()

    if (game.status === 'idle' || game.status === 'game-over') {
      startGame(nextDirection)
      return
    }

    queueDirection(nextDirection)
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/20">
      <div
        aria-label={t.home.panels.games.snake.boardLabel}
        className="flex min-h-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onKeyDown={handleKeyDown}
        ref={wrapperRef}
        role="application"
        tabIndex={0}
      >
        <canvas className="block h-full w-full" ref={canvasRef} />
      </div>
    </div>
  )
}
