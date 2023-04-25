import {useRef} from "react"
import {Layer, Rect, Stage} from "react-konva"
import {GRID_SIZE} from "../src/constants/CONSTANTS"

type BoardProps = {
	neighbors: boolean[][];
	cells: boolean[];
	setCells: (cells: any) => void;
};

export default function Board(props: BoardProps) {
	const painting = useRef<null | boolean>(null)
	const {neighbors, cells, setCells} = props

	const hypotenuse = Math.sqrt(SIDE_SIZE ** 2 * 2)

	return (
		<Stage
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
								x={(i % GRID_SIZE) * PIXEL_SIZE + SIDE_SIZE / 2}
								y={Math.floor(i / GRID_SIZE) * PIXEL_SIZE - SIDE_SIZE / 2}
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
								onMouseEnter={() => {
									if (painting.current !== null) {
										const aux = [...cells]
										aux[i] = painting.current
										setCells(aux)
									}
								}}
							/>
						)
					})}
					<Neighbors neighbors={neighbors}/>
				</>
			</Layer>
		</Stage>
	)
}

function Neighbors({neighbors}: { neighbors: Array<Array<boolean>> }) {
	return (
		<>
			<Canvas neighbors={neighbors[0]} yOffset={-SIDE_SIZE}/>
			<Canvas neighbors={neighbors[1]} xOffset={SIDE_SIZE}/>
			<Canvas neighbors={neighbors[2]} yOffset={SIDE_SIZE}/>
			<Canvas neighbors={neighbors[3]} xOffset={-SIDE_SIZE}/>
		</>
	)
}

function Canvas({
									neighbors,
									xOffset = 0,
									yOffset = 0
								}: { xOffset?: number, yOffset?: number, neighbors: Array<boolean> }) {
	return (
		<>
			{neighbors.map((value, i) => {
				return (
					<Pixel
						key={i.toString()}
						color={value ? "darkgreen" : "darkgrey"}
						x={(i % GRID_SIZE) * PIXEL_SIZE + SIDE_SIZE / 2 + xOffset}
						y={Math.floor(i / GRID_SIZE) * PIXEL_SIZE - SIDE_SIZE / 2 + yOffset}
					/>
				)
			})}
		</>
	)
}

function Pixel({color, x, y}: { x: number, y: number, color: string }) {
	return (
		<Rect
			fill={color}
			x={x}
			y={y}
			height={PIXEL_SIZE}
			width={PIXEL_SIZE}
			stroke={"black"}
			strokeWidth={0.5}
		/>
	)
}

const PIXEL_SIZE = 24 // change based on viewport
const SIDE_SIZE = PIXEL_SIZE * GRID_SIZE