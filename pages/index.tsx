import Head from "next/head"
import {useRef, useState} from "react"
import styled from "styled-components"

import {ethers} from "ethers"

const SIZE = 64

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const RPC_URL = "http://127.0.0.1:8545/"

const grid: Array<boolean> = Array(64 * 64).fill(false)
let painting: boolean | null = null

export default function Home() {
	return (
		<div>
			<Head>
				<title>Ginnungagap</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<Main>
				<Board>
					{grid.map((_, i) => <Cell index={i} key={i.toString()}/>)}
				</Board>
				<button
					onClick={() => {
						const value = grid.reduce(vectorToBigIntReducer, 0n)
						alert(value.toString())
					}}
				>
					Submit
				</button>
			</Main>
			<footer>
			</footer>
		</div>
	)
}

const vectorToBigIntReducer = (accumulator: bigint, current: boolean, i: number) =>
	!current ? accumulator : accumulator + powerOfTwo(i)
const powerOfTwo = (exponent: number) => BigInt(1) << BigInt(exponent)

function Cell({index}: { index: number }) {
	const ref = useRef(0)
	const [value, setValue] = useState<boolean>(false)

	return (
		<Circle
			filled={value!}
			onMouseEnter={() => {
				if (painting !== null) {
					ref.current = performance.now()
					setValue(painting)
					grid[index] = painting
				}
			}}
			onMouseDown={() => {
				ref.current = performance.now()
				painting = !value
				setValue(!value)
				grid[index] = !value
			}}
			onMouseUp={() => {
				//TODO THIS SHOULD BE A GLOBAL EVENT
				painting = null
			}}
		/>)
}

const Circle = styled.div<{ filled: boolean }>`
  border: 1px black solid;
  background-color: ${({filled}) => filled ? "black" : "white"};
  width: 12px;
  height: 12px;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
`

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(${SIZE}, 1fr);
`

async function getCanvas() {
	const abi = ["function getCanvas() view public returns (uint32[] memory)"]
	const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
	const signer = provider.getSigner()
	const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
	const contractWithSigner = smartContract.connect(signer)
	const neighbors = await contractWithSigner.getCanvas()
}
