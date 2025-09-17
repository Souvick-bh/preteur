"use client"
import {WalletMenu} from './components/HomeContent'
import { WalletProvider } from '@txnlab/use-wallet-react'
import { manager } from "./components/manager";



export default function Home() {
  return (
    <div className="font-sans grid min-w-screen min-h-screen justify-center p-8 pb-20 bg-[#000000]">
    
      <WalletProvider manager={manager}>
        <WalletMenu />



      </WalletProvider>
    
    </div>
  );
}
