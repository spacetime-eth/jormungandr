import Head from "next/head"
import styled from "styled-components"
import dynamic from "next/dynamic"
import {useState} from "react"
import {GRID_SIZE} from "../src/constants/CONSTANTS"
import useWeb3, {MetamaskStatus} from "../src/hooks/useWeb3"

const Board = dynamic(() => import("../components/Board"), {
	ssr: false
})

export default function Home() {
	const initialValue = 2n
	const [cells, setCells] = useState(
		Array(GRID_SIZE * GRID_SIZE)
			.fill(false)
			.map((_, i) => !!(powerOfTwo(i) & initialValue))
	)
	const [hasReserved, setHasReserved] = useState(false)
	const {connect, draw, reserveCanvas, metamaskStatus} = useWeb3()
	const [neighbors, setNeighbors] = useState<Array<Array<boolean>>>([])

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
							{hasReserved &&
                  <>
                      <Board neighbors={neighbors} cells={cells} setCells={setCells}/>
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
                  </>
							}
							{!hasReserved &&
                  <button
                      onClick={async () => {
												const neighbors = (await reserveCanvas()).map(toBinaryArray)
												console.log(neighbors)
												setNeighbors(neighbors)
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

const toBinaryArray = (value: bigint) => Array(GRID_SIZE * GRID_SIZE)
	.fill(false)
	.map((_, i) => (mask(i) & value) > 0n)

const mask = (value: number) => 1n << BigInt(value)
