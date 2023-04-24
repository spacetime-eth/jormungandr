import Head from "next/head"
import styled from "styled-components"
import dynamic from "next/dynamic"
import {useState} from "react"
import useWeb3, {MetamaskStatus} from "../src/hooks/useWeb3"

const Board = dynamic(() => import("../components/Board"), {
	ssr: false
})

export default function Home() {
	const GRID_SIZE = 16
	const initialValue = 2n
	const [cells, setCells] = useState(
		Array(GRID_SIZE * GRID_SIZE)
			.fill(false)
			.map((_, i) => !!(powerOfTwo(i) & initialValue))
	)
	const [hasReserved, setHasReserved] = useState(false)
	const [hasStarted, setHasStarted] = useState(true)
	const {connect, start, draw, reserveCanvas, getMyCanvas, metamaskStatus} = useWeb3()

	const neighbors = [
		Array(GRID_SIZE * GRID_SIZE)
			.fill(false)
			.map((_, i) => !!(i % 2)),
		Array(GRID_SIZE * GRID_SIZE)
			.fill(false)
			.map((_, i) => !(i % 3)),
		Array(GRID_SIZE * GRID_SIZE)
			.fill(false)
			.map((_, i) => !(i % 4)),
		Array(GRID_SIZE * GRID_SIZE)
			.fill(false)
			.map((_, i) => !!(i % 5))
	]

	return (
		<div>
			<Head>
				<title>Ginnungagap</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<Main>
				{metamaskStatus === MetamaskStatus.Missing && "Metamask not installed"}
				{metamaskStatus === MetamaskStatus.NotConnected && <button onClick={connect}>Connect Metamask</button>}
				{metamaskStatus === MetamaskStatus.Connected &&
            <>
							{!hasStarted && <button onClick={() => start()}>Start</button>}
							{hasStarted && hasReserved &&
                  <>
                      <Board
                          neighbors={neighbors}
                          gridSize={GRID_SIZE}
                          cells={cells}
                          setCells={setCells}
                      />
                      <button onClick={() => {
												setCells(Array(GRID_SIZE * GRID_SIZE).fill(false))
											}}>
                          Clear
                      </button>
                      <button
                          onClick={async () => {
														const value = cells.reduce(vectorToBigIntReducer, 0n)
														await draw(value)
														setHasReserved(false)
													}}
                      >
                          Draw
                      </button>
                      <button
                          onClick={async () => {
														const wea = await getMyCanvas()
														console.log(wea)
													}}
                      >
                          Get Canvas
                      </button>
                  </>
							}
							{hasStarted && !hasReserved &&
                  <button
                      onClick={async () => {
												await reserveCanvas()
												setHasReserved(true)
											}}
                  >
                      Reserve Canvas
                  </button>
							}
            </>
				}
			</Main>
			<footer></footer>
		</div>
	)
}

const vectorToBigIntReducer = (
	accumulator: bigint,
	current: boolean,
	i: number
) => (!current ? accumulator : accumulator + powerOfTwo(i))
const powerOfTwo = (exponent: number) => BigInt(1) << BigInt(exponent)

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
`
