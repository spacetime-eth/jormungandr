import Head from "next/head"
import styled from "styled-components"
import {BigNumber, Contract, ethers} from "ethers"

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ""

import dynamic from "next/dynamic"
import {useEffect, useState} from "react"

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

	const [metamaskStatus, setMetamaskStatus] = useState(MetamaskStatus.Unknown)
	const [contract, setContract] = useState<null | Contract>(null)

	useEffect(() => {
		if (metamaskStatus === MetamaskStatus.Unknown)
			// @ts-ignore
			if (typeof window.ethereum === "undefined")
				setMetamaskStatus(MetamaskStatus.Missing)
			else
				setMetamaskStatus(MetamaskStatus.NotConnected)
	}, [metamaskStatus])


	async function connect() {
		try {
			// @ts-ignore
			await ethereum.request({method: "eth_requestAccounts"})
			setContract(getContract())
			setMetamaskStatus(MetamaskStatus.Connected)
		} catch (error) {
			console.log(error)
			setMetamaskStatus(MetamaskStatus.Failed)
		}
		//const accounts = await ethereum.request({ method: "eth_accounts" })
		//console.log(accounts)
	}

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
                <Board
                    neighbors={neighbors}
                    gridSize={GRID_SIZE}
                    cells={cells}
                    setCells={setCells}
                />
                <button
                    onClick={() => {
											setCells(Array(GRID_SIZE * GRID_SIZE).fill(false))
										}}
                >
                    clear
                </button>
                <button
                    onClick={() => {
											const value = cells.reduce(vectorToBigIntReducer, 0n)
											draw(value, contract!)
										}}
                >
                    Submit
                </button>

                <button onClick={() => start(contract!)}>Start</button>
                <button
                    onClick={async () => {
											const wea = await getCanvas(contract!)
											console.log(wea)
										}}
                >
                    Get Canvas
                </button>
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

async function getCanvas(contract: Contract) {
	return await contract.getCanvas()
}

async function start(contract: Contract) {
	await contract.start()
}

async function draw(value: bigint, contract: Contract) {
	const bgnm = BigNumber.from(value)
	await contract.draw(bgnm)
}

function getContract() {
	const abi = [
		"function getCanvas() view public returns (uint32[] memory)",
		"function start() public returns (uint32)"
	]
	// @ts-ignore
	const provider = new ethers.providers.Web3Provider(ethereum)
	const signer = provider.getSigner()
	const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
	return smartContract.connect(signer)
}

enum MetamaskStatus {
	Unknown,
	Missing,
	NotConnected,
	Connected,
	Failed
}
