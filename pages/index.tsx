import Head from "next/head";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";

const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0x255DCcb7b7b8943A0F6b2D54e02f508aDfce0873";
// const CONTRACT_ADDRESS = "0x255DCcb7b7b8943A0F6b2D54e02f508aDfce0873";
const RPC_URL = "http://127.0.0.1:8545/";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Board = dynamic(() => import("../components/Board"), {
  ssr: false,
});

export default function Home() {
  const GRID_SIZE = 16;
  const initialValue = 2n;
  const [cells, setCells] = useState(
    Array(GRID_SIZE * GRID_SIZE)
      .fill(false)
      .map((_, i) => !!(powerOfTwo(i) & initialValue))
  );

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
      .map((_, i) => !!(i % 5)),
  ];

  return (
    <div>
      <Head>
        <title>Ginnungagap</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Board
          neighbors={neighbors}
          gridSize={GRID_SIZE}
          cells={cells}
          setCells={setCells}
        />
        <button
          onClick={() => {
            setCells(Array(GRID_SIZE * GRID_SIZE).fill(false));
          }}
        >
          clear
        </button>
        <button
          onClick={() => {
            const value = cells.reduce(vectorToBigIntReducer, 0n);
            draw(value);
          }}
        >
          Submit
        </button>
        <button onClick={connect}>Connect Metamask</button>
        <button onClick={start}>Start</button>
        <button
          onClick={async () => {
            const wea = await getCanvas();
            console.log(wea);
          }}
        >
          Get Canvas
        </button>
      </Main>
      <footer></footer>
    </div>
  );
}

const vectorToBigIntReducer = (
  accumulator: bigint,
  current: boolean,
  i: number
) => (!current ? accumulator : accumulator + powerOfTwo(i));
const powerOfTwo = (exponent: number) => BigInt(1) << BigInt(exponent);

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
`;

async function getCanvas() {
  const abi = [
    "function getCanvas() view public returns (uint32[] memory)",
    "function start() public returns (uint32)",
  ];
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  const contractWithSigner = smartContract.connect(signer);
  return await contractWithSigner.getCanvas();
}

async function start() {
  const abi = [
    "function getCanvas() view public returns (uint32[] memory)",
    "function start() public returns (uint32)",
  ];
  // @ts-ignore
  console.log("ADDRESS", CONTRACT_ADDRESS);
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  const contractWithSigner = smartContract.connect(signer);

  await contractWithSigner.start();
}

async function draw(value: bigint) {
  const abi = ["function draw(uint32 drawing) public returns (uint32)"];
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const smartContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  const contractWithSigner = smartContract.connect(signer);

  const bgnm = BigNumber.from(value);
  console.log(value);
  console.log(bgnm);
  await contractWithSigner.draw(bgnm);
}

async function connect() {
  // @ts-ignore
  if (typeof window.ethereum !== "undefined") {
    try {
      // @ts-ignore
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    //const accounts = await ethereum.request({ method: "eth_accounts" })
    //console.log(accounts)
  } else {
  }
}
