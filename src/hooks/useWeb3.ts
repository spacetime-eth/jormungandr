import {Web3Provider} from "@ethersproject/providers"
import {BigNumber, Contract, ethers} from "ethers"
import {useCallback, useEffect, useState} from "react"

export default function useWeb3() {
	const [metamaskStatus, setMetamaskStatus] = useState(MetamaskStatus.Unknown)
	const [contract, setContract] = useState<null | Contract>(null)
	const [provider, setProvider] = useState<null | Web3Provider>(null)

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
			//await ethereum.request({method: "eth_requestAccounts"})
			//const accounts = await ethereum.request({ method: "eth_accounts" })
			//console.log(accounts)
			// @ts-ignore
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
			const contract = smartContract.connect(signer)
			setProvider(provider)
			setContract(contract)
			setMetamaskStatus(MetamaskStatus.Connected)
		} catch (error) {
			console.log(error)
			setMetamaskStatus(MetamaskStatus.Failed)
		}
	}, [])

	const getMyCanvas = useCallback(async () => {
		if (contract === null || provider === null) return
		return await contract.getMyCanvas()
	}, [contract, provider])

	const draw = useCallback(async (value: bigint) => {
		if (contract === null || provider === null) return
		const bgnm = BigNumber.from(value)
		await contract.draw([bgnm])
	}, [contract, provider])

	const reserveCanvas = useCallback(async () => {
		if (contract === null || provider === null) return
		const tsx = await contract.reserveCanvas()
		await tsx.wait(0)
		return (await contract.getMyCanvas()).map((x: any) => BigInt(x[0]._hex))
	}, [contract, provider])

	return {connect, draw, getMyCanvas, reserveCanvas, metamaskStatus}
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
	"function getMyCanvas() view public returns (uint256[1][4] memory)",
	"function draw(uint256[1] drawing) public",
	"function reserveCanvas() public"
]
