import Head from "next/head"
import {useState} from "react"
import styled from "styled-components"

import {ethers} from "ethers"

const SIZE = 10
const TOTAL = SIZE * SIZE

//const CELL: bigint = BigInt(2) ** BigInt(SIZE)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const RPC_URL = "http://127.0.0.1:8545/"

export default function Home() {
	const [value, setValue] = useState<bigint>(0n)

	return (
		<div>
			<Head>
				<title>Ginnungagap</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<Main>
				<Input onChange={setValue} value={value}/>
				<Board>
					{Array.from(Array(TOTAL), (_, i) => {
						const mask = BigInt(1 << i)
						return (value & mask) != 0n
					}).map((x, i) => <Circle filled={x} key={i.toString()}/>)}
				</Board>
			</Main>
			<footer>
			</footer>
		</div>
	)
}

function Input({onChange, value}: { onChange: (value: bigint) => void, value: bigint }) {
	const [current, setCurrent] = useState(value.toString())

	return (
		<input
			type="number"
			value={current}
			onChange={(e) => setCurrent(e.target.value)}
			onBlur={(e) => onChange(BigInt(e.target.value))}
			min={0}
		/>
	)
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
