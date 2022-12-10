import getNeighbors, {Neighbors} from "./GetNeighbors"

const expectations: Array<{ value: number, neighbors: Neighbors }> = [
	{value: 0, neighbors: {}},
	{value: 1, neighbors: {bottom: 0}},
	{value: 2, neighbors: {left: 0}},
	{value: 3, neighbors: {top: 0}},
	{value: 4, neighbors: {right: 0}},
	{value: 5, neighbors: {bottom: 1}},
	{value: 6, neighbors: {bottom: 2, left: 1}},
	{value: 7, neighbors: {left: 2}},
	{value: 8, neighbors: {top: 2, left: 3}},
	{value: 9, neighbors: {top: 3}},
	{value: 10, neighbors: {top: 4, right: 3}},
	{value: 11, neighbors: {right: 4}},
	{value: 12, neighbors: {right: 1, bottom: 4}},
	{value: 13, neighbors: {bottom: 5}},
	{value: 14, neighbors: {bottom: 6, left: 5}},
	{value: 15, neighbors: {bottom: 7, left: 6}},
	{value: 16, neighbors: {left: 7}},
	{value: 17, neighbors: {top: 7, left: 8}},
	{value: 18, neighbors: {top: 8, left: 9}},
	{value: 19, neighbors: {top: 9}},
	{value: 20, neighbors: {top: 10, right: 9}},
	{value: 21, neighbors: {top: 11, right: 10}},
	{value: 22, neighbors: {right: 11}},
	{value: 23, neighbors: {right: 12, bottom: 11}},
	{value: 24, neighbors: {right: 5, bottom: 12}},
	{value: 25, neighbors: {bottom: 13}},
	{value: 26, neighbors: {bottom: 14, left: 13}}
]

describe("GetNeighbors should", () => {
	expectations.map(({value, neighbors}) => it(`when called with ${value} returns ${JSON.stringify(neighbors)}`, () =>
		expect(getNeighbors(value)).toEqual(neighbors)
	))
})

