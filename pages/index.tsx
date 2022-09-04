import Head from "next/head"
import {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import {BigNumber, ethers} from "ethers"

const SIZE = 64

const CONTRACT_ADDRESS = "0x929e8eeD62760566b6E08564a6C040da13229487"
const RPC_URL = "http://127.0.0.1:8545/"

const grid: Array<boolean> = Array(SIZE * SIZE).fill(false)
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
					}}
				>
					clear
				</button>
				<button
					onClick={() => {
						const value = grid.reduce(vectorToBigIntReducer, 0n)
						draw(value)
					}}
				>
					Submit
				</button>
				<button
					onClick={connect}
				>
					Connect Metamask
				</button>
				<button
					onClick={start}
				>
					Start
				</button>
				<button
					onClick={async () => {
						const wea = await getCanvas()
						console.log(wea)
					}}
				>
					Get Canvas
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
  border-left-width: 0px;
  border-top-width: 0px;
  background-color: ${({filled}) => filled ? "black" : "white"};
  width: 8px;
  height: 8px;
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
	const abi = [
		"function getCanvas() view public returns (uint32[] memory)",
		"function start() public returns (uint32)"
	]
	// @ts-ignore
	const provider = new ethers.providers.Web3Provider(ethereum)
	const signer = provider.getSigner()
	const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
	const contractWithSigner = smartContract.connect(signer)
	return await contractWithSigner.getCanvas()
}

async function start() {
	const abi = [
		"function getCanvas() view public returns (uint32[] memory)",
		"function start() public returns (uint32)"
	]
	// @ts-ignore
	const provider = new ethers.providers.Web3Provider(ethereum)
	const signer = provider.getSigner()
	const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
	const contractWithSigner = smartContract.connect(signer)

	await contractWithSigner.start()
}

async function draw(value: bigint) {
	const abi = [
		"function draw(uint32 drawing) public returns (uint32)"
	]
	// @ts-ignore
	const provider = new ethers.providers.Web3Provider(ethereum)
	const signer = provider.getSigner()
	const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
	const contractWithSigner = smartContract.connect(signer)

	const bgnm = BigNumber.from(value)
	console.log(value)
	console.log(bgnm)
	await contractWithSigner.draw(bgnm)
}


async function connect() {
	// @ts-ignore
	if (typeof window.ethereum !== "undefined") {
		try {
			// @ts-ignore
			await ethereum.request({method: "eth_requestAccounts"})
		} catch (error) {
			console.log(error)
		}
		//const accounts = await ethereum.request({ method: "eth_accounts" })
		//console.log(accounts)
	} else {

	}
}