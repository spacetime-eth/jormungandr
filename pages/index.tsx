import Head from "next/head"
import {useState} from "react"
import styled from "styled-components"

const SIZE = 4
const TOTAL = SIZE * SIZE
//const CELL: bigint = 2n ** BigInt(TOTAL)

export default function Home() {
	const [value, setValue] = useState<bigint>(BigInt(0))
	return (
		<div>
			<Head>
				<title>Ginnungagap</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<Main>
				<Input onChange={setValue} value={value}/>
				<Board>
					{Array.from(Array(TOTAL), (_, i) =>  {
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
