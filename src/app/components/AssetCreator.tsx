"use client";
import { useWallet, type Wallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import React from 'react'

export default function AssetCreator() {

  // const algodToken = '';
  // const algodServer = 'https://testnet-api.algonode.cloud';
  // const algodPort = '';

  // const algodClient = new algosdk.Algodv2(algodToken,algodServer,algodPort);

  const {wallets, activeWallet,activeAddress,signTransactions,algodClient } = useWallet();
  const creator = activeWallet?.activeAccount?.address

  async function handleCreate() {
    if(!creator) {
      alert("Nope")
    }
    const suggestedParams = await algodClient.getTransactionParams().do();

    const unitName = (document.getElementById('unitName') as HTMLInputElement | null)?.value || '';
    const assetName = (document.getElementById('assetName') as HTMLInputElement | null)?.value || '';
    const supply = (document.getElementById('supply') as HTMLInputElement | null)?.value || Number;
    const decimals = (document.getElementById('decimals') as HTMLInputElement | null)?.value || Number;
    const uri = (document.getElementById('uri') as HTMLInputElement | null)?.value || '';

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      //@ts-ignore
      sender: creator,
      suggestedParams,
      defaultFrozen: false,
      unitName: unitName,
      assetName: assetName,
      manager: creator,
      reserve: creator,
      freeze: creator,
      clawback: creator,
      assetURL: uri,
      //@ts-ignore
      total: 1,
      //@ts-ignore
      decimals: 0,
    });

    const signedTxn = await signTransactions([txn])
    //@ts-ignore
    const { txid } = await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(
      algodClient,
      txid,
      3
    );
  }



    return(
        <div>
          <div className='flex flex-col gap-3 items-center'>
            <input className='border-1 border-[#252525] p-1 w-fit' placeholder='Unit-Name' id='unitName' type="text" />
            <input className='border-1 border-[#252525] p-1 w-fit' placeholder='Asset-Name' id='assetName' type="text" />
            <input className='border-1 border-[#252525] p-1 w-fit' placeholder='Supply' id='supply' type="number" />
            <input className='border-1 border-[#252525] p-1 w-fit' placeholder='Asset-Offchain_Url' id='uri' type="text" />
            <input className='border-1 border-[#252525] p-1 w-fit' placeholder='Decimals' id='decimals' type="number" />

            <button className='border-2 border-[#252525] pt-1 pb-1 pr-4 pl-4 rounded-2xl w-fit' onClick={handleCreate}>Create</button>
            
          </div>

        </div>
    )
}

