import {BigNumber, Contract, ethers} from "ethers"
import {useCallback, useEffect, useState} from "react"

export default function useWeb3() {
	const [metamaskStatus, setMetamaskStatus] = useState(MetamaskStatus.Unknown)
	const [contract, setContract] = useState<null | Contract>(null)

	useEffect(() => {
		switch (metamaskStatus) {
			case MetamaskStatus.Unknown: {
				if (metamaskStatus === MetamaskStatus.Unknown)
					// @ts-ignore
					if (typeof window.ethereum === "undefined")
						setMetamaskStatus(MetamaskStatus.Missing)
					else
						setMetamaskStatus(MetamaskStatus.NotConnected)
				break
			}
		}
	}, [metamaskStatus])

	const connect = useCallback(() => {
		try {
			// @ts-ignore
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
			const contract = smartContract.connect(signer)
			setContract(contract)
			setMetamaskStatus(MetamaskStatus.Connected)
		} catch (error) {
			console.log(error)
			setMetamaskStatus(MetamaskStatus.Failed)
		}
	}, [])

	const draw = useCallback(async (value: bigint) => {
		if (contract === null) return
		const bgnm = BigNumber.from(value)
		await contract.draw(bgnm)
	}, [contract])

	const reserveCanvas = useCallback(async () => {
		if (contract === null) return
		const tsx = await contract.reserveCanvas()
		await tsx.wait(0)
		return (await contract.getMyNeighbors()).map((x: any) => BigInt(x._hex))
	}, [contract])

	return {connect, draw, reserveCanvas, metamaskStatus}
}

export enum MetamaskStatus {
	Unknown,
	Missing,
	NotConnected,
	Connected,
	Failed
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

const abi = [
	"function getMyNeighbors() view public returns (uint256[4] memory)",
	"function draw(uint256 drawing) public",
	"function reserveCanvas() public"
]
