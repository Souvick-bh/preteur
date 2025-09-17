"use client"

import { useWallet, type Wallet } from '@txnlab/use-wallet-react'
import { useState } from 'react'
import AssetCreator from './AssetCreator'
import LendingUI from './LendingUI'

export const WalletMenu = () => {
  const { wallets, activeWallet } = useWallet()

  
  // If we have an active wallet, show the connected view
  if (activeWallet) {
    return(
        <div className='flex flex-col gap-6 text-[#ffffff]'>
            <ConnectedWallet wallet={activeWallet} />
            <AssetCreator />
            <LendingUI />
        </div>
    ) 
  }
  
  // Otherwise, show the wallet selection list
  return <WalletList wallets={wallets} />
}

const WalletList = ({ wallets }: { wallets: Wallet[] }) => {
  return (
    <div className="wallet-list flex flex-col text-[#ffffff] justify-center items-center gap-5 border-2 border-[#252525] p-8 rounded-4xl h-fit w-fit duration-300 ease-in-out hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[5px_5px_1px_0px_rgba(255,255,255)]">
      <h3 className='font-medium'>Connect Wallet</h3>
      <div className="wallet-options flex gap-4">
        {wallets.map((wallet) => (
          <WalletOption
            key={wallet.id}
            wallet={wallet}
          />
        ))}
      </div>
    </div>
  )
}

const WalletOption = ({ wallet }: { wallet: Wallet }) => {
  const [connecting, setConnecting] = useState(false)
  
  const handleConnect = async () => {
    setConnecting(true)
    try {
      await wallet.connect()
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setConnecting(false)
    }
  }
  
  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="wallet-option flex flex-row items-center gap-2 border-2 border-[#252525] p-1 rounded-2xl cursor-pointer hover:bg-[#1f1f1f]"
    >
      <img
        src={wallet.metadata.icon}
        alt={wallet.metadata.name}
        width={32}
        height={32}
        className='rounded-full'
      />
      <span>{wallet.metadata.name}</span>
    </button>
  )
}

const ConnectedWallet = ({ wallet }: { wallet: Wallet }) => {
  return (
    <div className="connected-wallet flex flex-col justify-center items-center gap-5 border-2 border-[#252525] p-8 rounded-4xl h-fit w-fit duration-300 ease-in-out hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[5px_5px_1px_0px_rgba(255,255,255)]">
      {/* Wallet header */}
      <div className="wallet-header flex flex-row gap-4 items-center">
        <img
          src={wallet.metadata.icon}
          alt={wallet.metadata.name}
          width={32}
          height={32}
          className='rounded-full'
        />
        <span>{wallet.metadata.name}</span>
      </div>
      
      {/* Account selector */}
      {wallet.accounts.length > 1 && (
        <select
          value={wallet.activeAccount?.address}
          onChange={(e) => wallet.setActiveAccount(e.target.value)}
        >
          {wallet.accounts.map((account) => (
            <option key={account.address} value={account.address}>
              {account.name}
            </option>
          ))}
        </select>
      )}
      
      {/* Account details */}
      {wallet.activeAccount && (
        <div className="account-info">
          <span>{wallet.activeAccount.name} : </span>
          <span>{wallet.activeAccount.address}</span>
        </div>
      )}
      
      {/* Disconnect button */}
      <button className='border-2 border-[#252525] pt-2 pb-2 pr-4 pl-4 rounded-2xl cursor-pointer hover:bg-[#1f1f1f]' onClick={wallet.disconnect}>
        Disconnect
      </button>
    </div>
  )
}