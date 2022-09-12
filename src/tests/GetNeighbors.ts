export default function getNeighbors(value: number): Neighbors {
	if (value === 0) return {}
	let ringIndex = value

	let ring = 1
	while (ringIndex > ring * 4) {
		ringIndex -= ring * 4
		ring++
	}
	ringIndex--
	const lineIndex = ringIndex % ring

	//This is the side in which the board will grow
	//0: top-right
	//1: bottom-right
	//2: bottom-left
	//3: top-left
	const side = Math.floor(ringIndex / ring)

	const primary = sides[side]

	//ring 1 is a special case for some reason
	const primaryValue = value - side - (ring === 1 ? 1 : (ring - 1) * 4)

	if (lineIndex === 0)
		return {[primary]: primaryValue}
	else {
		const secondary = sides[(side + 1) % 4]
		//last item of the ring is special because it connects to the beginning of last ring
		const isLastRingIndex = ringIndex === (ring * 4) - 1

		return {
			[primary]: primaryValue - (isLastRingIndex ? (ring - 1) * 4 : 0),
			[secondary]: primaryValue - 1
		}
	}
}

const sides = ["bottom", "left", "top", "right"] as const

export type Neighbors = Partial<Record<"top" | "right" | "bottom" | "left", number>>