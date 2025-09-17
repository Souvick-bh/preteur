"use client"
import {WalletMenu} from './components/HomeContent'
import { WalletProvider } from '@txnlab/use-wallet-react'
import { manager } from "./components/manager";
import LendingUI from './components/LendingUI';


export default function Home() {
  return (
    <div className="font-sans grid min-w-screen min-h-screen justify-center p-8 pb-20 ">
      <WalletProvider manager={manager}>
        <WalletMenu />

        <LendingUI />



      </WalletProvider>
    </div>
  );
}
