import init, { Direction, World, GameStatus } from 'snake-game'
import { random } from './random'

init().then((wasm) => {
    const CELL_SIZE = 30
    const WORLD_WIDTH = 15
    const snakeSpawnIdx = random(WORLD_WIDTH * WORLD_WIDTH)

    const world = World.new(WORLD_WIDTH, snakeSpawnIdx)

    const gameControlBtn = document.getElementById('game-control-btn')
    const gameStatusLabel = document.getElementById('game-status')
    const pointsLabel = document.getElementById('points')
    const canvas = <HTMLCanvasElement> document.getElementById('snake-canvas')

    const ctx = canvas.getContext('2d')
    canvas.height = WORLD_WIDTH * CELL_SIZE
    canvas.width = WORLD_WIDTH * CELL_SIZE

    gameControlBtn.addEventListener('click', event => {
        const status = world.game_status()

        if (status === undefined) {
            gameControlBtn.textContent = 'Playing...'
            world.start_game()
            play()
        } else {
            location.reload()
        }
    })

    document.addEventListener('keydown', event => {
        switch(event.code) {
            case 'ArrowUp':
                world.change_snake_direction(Direction.Up)
                break
            case 'ArrowRight':
                world.change_snake_direction(Direction.Right)
                break
            case 'ArrowDown':
                world.change_snake_direction(Direction.Down)
                break
            case 'ArrowLeft':
                world.change_snake_direction(Direction.Left)
                break
        }
    })
    
    const drawWorld = () => {
        ctx.beginPath()

        for (let x = 0; x < WORLD_WIDTH + 1; x++) {
            ctx.moveTo(CELL_SIZE * x , 0)
            ctx.lineTo(CELL_SIZE * x, WORLD_WIDTH * CELL_SIZE)
        }

        for (let y = 0; y < WORLD_WIDTH + 1; y++) {
            ctx.moveTo(0, CELL_SIZE * y)
            ctx.lineTo(WORLD_WIDTH * CELL_SIZE, CELL_SIZE * y)
        }
        ctx.stroke()
    }

    const drawRewardCell = () => {
        const idx = world.reward_cell()
        const col = idx % WORLD_WIDTH
        const row = Math.floor(idx / WORLD_WIDTH)

        ctx.fillStyle = '#ff0000'

        ctx.beginPath()
        ctx.fillRect(
            col * CELL_SIZE,
            row * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        )
        ctx.stroke()
    }

    const drawSnake = () => {
        const snakeCells = new Uint32Array(wasm.memory.buffer, world.snake_cells(), world.snake_length())

        snakeCells
        .slice()
        .reverse()    
        .forEach((cellIdx, i) => {
            const col = cellIdx % WORLD_WIDTH
            const row = Math.floor(cellIdx / WORLD_WIDTH)

            ctx.fillStyle = i === snakeCells.length - 1 ? '#7878db' : '#000'

            ctx.beginPath()
            ctx.fillRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            )
        })
        ctx.stroke()
    }

    const drawGameStatus = () => {
        gameStatusLabel.textContent = world.game_status_text()
        pointsLabel.textContent = world.points().toString()
    }

    const paint = () => {
        drawWorld()
        drawSnake()
        drawRewardCell()
        drawGameStatus()
    }

    const play = () => {
        const status = world.game_status()

        if (status === GameStatus.Won || status === GameStatus.Lost) {
            gameControlBtn.textContent = 'Re-Play'
            return
        }

        const fps = 10

        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            world.step()
            paint()
            requestAnimationFrame(play)
        }, 1000 / fps)
    }

    paint()
})