"use client";
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import React from 'react'

export default function AssetCreator() {


  const { activeWallet,signTransactions,algodClient } = useWallet();
  const creator = activeWallet?.activeAccount?.address

  async function handleCreate() {
    if(!creator) {
      console.log("Nope")
    }
    const suggestedParams = await algodClient.getTransactionParams().do();

    const unitName = (document.getElementById('unitName') as HTMLInputElement | null)?.value || '';
    const assetName = (document.getElementById('assetName') as HTMLInputElement | null)?.value || '';
    const supply = Number((document.getElementById('supply') as HTMLInputElement | null)?.value || Number);
    const decimals = Number((document.getElementById('decimals') as HTMLInputElement | null)?.value || Number);
    const uri = (document.getElementById('uri') as HTMLInputElement | null)?.value || '';

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
     //@ts-expect-error: assigning string to number for test
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
      
      total: supply,
      decimals: decimals,
    });

    const signedTxn = await signTransactions([txn])
    //@ts-expect-error: assigning string to number for test
    const { txid } = await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(
      algodClient,
      txid,
      3
    );
    console.log(result)
  }



    return(
        <div>
          <div className='flex flex-col bg-transparent justify-center items-center gap-5 border-2 border-[#252525] p-8 rounded-4xl h-fit w-full mb-8 duration-300 ease-in-out hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[5px_5px_1px_0px_rgba(255,255,255)]'>
            <div className='font-semibold '>Token Launchpad</div>
            <input className='border-1 rounded-lg border-[#252525] p-1 w-fit' placeholder='Unit-Name' id='unitName' type="text" />
            <input className='border-1 rounded-lg border-[#252525] p-1 w-fit' placeholder='Asset-Name' id='assetName' type="text" />
            <input className='border-1 rounded-lg border-[#252525] p-1 w-fit' placeholder='Supply' id='supply' type="number" />
            <input className='border-1 rounded-lg border-[#252525] p-1 w-fit' placeholder='URI (optional)' id='uri' type="text" />
            <input className='border-1 rounded-lg border-[#252525] p-1 w-fit' placeholder='Decimals' id='decimals' type="number" />

            <button className='border-2 border-[#252525] pt-1 pb-1 pr-4 pl-4 rounded-2xl w-fit cursor-pointer hover:bg-[#1f1f1f]' onClick={handleCreate}>Create</button>
            
          </div>

        </div>
    )
}

