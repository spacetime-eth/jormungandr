import Head from "next/head"
import {useEffect, useState} from "react"
import styled from "styled-components"
import JSBI from "jsbi"

import {ethers} from "ethers"

const ZERO = JSBI.BigInt(0)
const ONE = JSBI.BigInt(1)

const SIZE = 64
const TOTAL = SIZE * SIZE
const CELLS = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(TOTAL))
const MASKS = Array.from(Array(TOTAL), (_, i) => JSBI.leftShift(ONE, JSBI.BigInt(i)))

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const RPC_URL = "http://127.0.0.1:8545/"

export default function Home() {
	const [value, setValue] = useState<JSBI>(ZERO)

	return (
		<div>
			<Head>
				<title>Ginnungagap</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<Main>
				<Preview value={value}/>
				<Board>
					{MASKS.map((mask, i) =>
						<Circle
							filled={isFilled({mask, value})}
							key={i.toString()}
							onClick={() => setValue(JSBI.bitwiseXor(value, mask))}
						/>)
					}
				</Board>
			</Main>
			<footer>
			</footer>
		</div>
	)
}

function Preview({value}: { value: JSBI }) {
	return (
		<span>{value.toString().padStart(CELLS.toString().length, "0")}</span>
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

function isFilled({mask, value}: { mask: JSBI, value: JSBI }) {
	return JSBI.NE(JSBI.bitwiseAnd(value, mask), ZERO)
}

async function getCanvas() {
	const abi = ["function getCanvas() view public returns (uint32[] memory)"]
	const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
	const signer = provider.getSigner()
	const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
	const contractWithSigner = smartContract.connect(signer)
	const neighbors = await contractWithSigner.getCanvas()
}
