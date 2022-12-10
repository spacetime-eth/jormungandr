import {useRef, useState} from "react"
import {Layer, Rect, Stage} from "react-konva"

type BoardProps = {
	neighbors: boolean[][];
	gridSize: number;
	cells: boolean[];
	setCells: (cells: any) => void;
};

export default function Board(props: BoardProps) {
	const painting = useRef<null | boolean>(null)
	const PIXEL_SIZE = 24 // change based on viewport
	const {neighbors, gridSize, cells, setCells} = props

	const side = PIXEL_SIZE * gridSize
	const hypotenuse = Math.sqrt(side ** 2 * 2)

	return (
		<Stage
			onClick={(e) => console.log(e)}
			width={hypotenuse}
			height={hypotenuse}
			style={{border: "1px solid red"}}
		>
			<Layer rotation={45}>
				<>
					{cells.map((value, i) => {
						return (
							<Rect
								fill={value ? "red" : "white"}
								key={i.toString()}
								x={(i % gridSize) * PIXEL_SIZE + side / 2}
								y={Math.floor(i / gridSize) * PIXEL_SIZE - side / 2}
								height={PIXEL_SIZE}
								width={PIXEL_SIZE}
								stroke={"black"}
								strokeWidth={0.5}
								onMouseDown={() => {
									painting.current = !cells[i]
									const aux = [...cells]
									aux[i] = painting.current
									setCells(aux)
								}}
								onMouseUp={() => {
									painting.current = null
								}}
								onMouseEnter={(e) => {
									if (painting.current !== null) {
										const aux = [...cells]
										aux[i] = painting.current
										setCells(aux)
									}
								}}
							/>
						)
					})}
					{neighbors[0].map((value, i) => {
						return (
							<Rect
								fill={value ? "green" : "white"}
								key={i.toString()}
								x={(i % gridSize) * PIXEL_SIZE + side / 2}
								y={Math.floor(i / gridSize) * PIXEL_SIZE - side / 2 - side}
								height={PIXEL_SIZE}
								width={PIXEL_SIZE}
								stroke={"black"}
								strokeWidth={0.5}
							/>
						)
					})}
					{neighbors[1].map((value, i) => {
						return (
							<Rect
								fill={value ? "green" : "white"}
								key={i.toString()}
								x={(i % gridSize) * PIXEL_SIZE + side / 2 + side}
								y={Math.floor(i / gridSize) * PIXEL_SIZE - side / 2}
								height={PIXEL_SIZE}
								width={PIXEL_SIZE}
								stroke={"black"}
								strokeWidth={0.5}
							/>
						)
					})}
					{neighbors[2].map((value, i) => {
						return (
							<Rect
								fill={value ? "green" : "white"}
								key={i.toString()}
								x={(i % gridSize) * PIXEL_SIZE + side / 2}
								y={Math.floor(i / gridSize) * PIXEL_SIZE - side / 2 + side}
								height={PIXEL_SIZE}
								width={PIXEL_SIZE}
								stroke={"black"}
								strokeWidth={0.5}
							/>
						)
					})}
					{neighbors[3].map((value, i) => {
						return (
							<Rect
								fill={value ? "green" : "white"}
								key={i.toString()}
								x={(i % gridSize) * PIXEL_SIZE + side / 2 - side}
								y={Math.floor(i / gridSize) * PIXEL_SIZE - side / 2}
								height={PIXEL_SIZE}
								width={PIXEL_SIZE}
								stroke={"black"}
								strokeWidth={0.5}
							/>
						)
					})}
				</>
			</Layer>
		</Stage>
	)
}

const vectorToBigIntReducer = (
	accumulator: bigint,
	current: boolean,
	i: number
) => (!current ? accumulator : accumulator + powerOfTwo(i))

const powerOfTwo = (exponent: number) => BigInt(1) << BigInt(exponent)
