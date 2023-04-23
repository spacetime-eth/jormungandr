import Head from "next/head"
import styled from "styled-components"
import { BigNumber, Contract, ethers } from "ethers"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

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
			await ethereum.request({ method: "eth_requestAccounts" })
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
				<link rel="icon" href="/favicon.ico" />
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
						<button onClick={() => start(contract!)}>Start</button>
						<button
							onClick={() => {
								setCells(Array(GRID_SIZE * GRID_SIZE).fill(false))
							}}
						>
							Clear
						</button>
						{!hasReserved ? (<button
							onClick={async () => {
								await reserveCanvas(contract!)
								setHasReserved(true)
							}}
						>
							Reserve Canvas
						</button>) : (
							<>
								<button
									onClick={async () => {
										const value = cells.reduce(vectorToBigIntReducer, 0n)
										await draw(value, contract!)
										setHasReserved(false)
									}}
								>
									Draw
								</button>
								<button
									onClick={async () => {
										const wea = await getMyCanvas(contract!)
										console.log(wea)
									}}
								>
									Get Canvas
								</button>
							</>
						)
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

async function getMyCanvas(contract: Contract) {
	return await contract.getMyCanvas()
}

async function start(contract: Contract) {
	await contract.start()
}

async function draw(value: bigint, contract: Contract) {
	const bgnm = BigNumber.from(value)
	// await contract.draw(bgnm)

	await contract.draw([bgnm])
}

async function reserveCanvas(contract: Contract) {
	await contract.reserveCanvas()
}

function getContract() {
	const abi = [
		"function getMyCanvas() view public returns (uint256[1][4] memory)",
		"function start() public returns (uint32)",
		"function draw(uint256[1] drawing) public",
		"function reserveCanvas() public",
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
