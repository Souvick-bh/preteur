"use client";

import { useWallet,  } from '@txnlab/use-wallet-react'
import React from 'react'
import supabase from '../connectSupabase/client'
import algosdk from 'algosdk';




function LoanCreator() {
  
//   const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")


//   const [loans, setLoans] = useState<any[]>([]);
  const { activeWallet,signTransactions, algodClient } = useWallet()

  const central_secret = new Uint8Array([186, 131, 247, 63, 0, 57, 7, 26, 200, 149, 190,
    194, 11, 170, 18, 245, 222, 2, 232, 212, 189, 180,
    190, 63, 247, 170, 15, 187, 226, 203, 233, 147, 117,
    227, 130, 66, 193, 24, 12, 225, 123, 180, 96, 132,
    226, 151, 119, 186, 183, 189, 155, 169, 212, 21, 34,
    206, 43, 34, 50, 108, 248, 130, 122, 177])

  const mnemonic = algosdk.secretKeyToMnemonic(central_secret);
  const { addr, sk } = algosdk.mnemonicToSecretKey(mnemonic);
  console.log(addr)
  // useEffect(() => {
  //   fetchLoans();
  // }, []);

  async function sendAmt(borrowerAddr: string) {
    if (activeWallet) {
      const suggestedParams = await algodClient.getTransactionParams().do();
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: addr,
        //@ts-ignore
        receiver: borrowerAddr,
        amount: 5000000, // in microAlgos (1 Algo = 1,000,000 microAlgos)
        suggestedParams,
      });
      const signedTxn = txn.signTxn(sk);
      //@ts-ignore
     const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
     const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
     console.log(confirmedTxn)
    }
  }

  async function sendTransfer() {


    //@ts-ignore
    
    if (!activeWallet || !activeWallet.activeAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
        const assetId = Number((document.getElementById('assetid') as HTMLInputElement).value)
      
        const params = await algodClient.getTransactionParams().do();
        const txn =  algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          //@ts-ignore
          sender: addr,
          receiver: addr,
          amount: 0,
          assetIndex: assetId, // <-- your NFT ASA ID
          suggestedParams: params,
        });

      const encodedTxn = algosdk.encodeUnsignedTransaction(txn);

//@ts-ignore
const signedTxns = await activeWallet.wallet?.signTransactions([encodedTxn]);

//@ts-ignore
const signedBlobs = signedTxns!.map((b64) =>
  new Uint8Array(Buffer.from(b64, "base64"))
);
  //@ts-ignore
  const { txId } = await algodClient.sendRawTransaction(signedBlobs!).do();
  await algosdk.waitForConfirmation(algodClient, txId, 4);

  console.log("NFT transferred with txId:", txId);
    } catch (err) {
        console.error(err);
    }
    try {
      const assetId = Number((document.getElementById('assetid') as HTMLInputElement).value)
      
        const params = await algodClient.getTransactionParams().do();
        const txn =  algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          //@ts-ignore
          sender: activeWallet.activeAccount?.address,
          receiver: addr,
          amount: 1,
          assetIndex: assetId, // <-- your NFT ASA ID
          suggestedParams: params,
        });
        // Encode the unsigned txn for wallet signing
 const encodedTxn = algosdk.encodeUnsignedTransaction(txn);

//@ts-ignore
const signedTxns = await activeWallet.wallet?.signTransactions([encodedTxn]);

//@ts-ignore
const signedBlobs = signedTxns!.map((b64) =>
  new Uint8Array(Buffer.from(b64, "base64"))
);
  //@ts-ignore
  const { txId } = await algodClient.sendRawTransaction(signedBlobs!).do();
  await algosdk.waitForConfirmation(algodClient, txId, 4);

  console.log("NFT transferred with txId:", txId);

  await sendAmt(activeWallet.activeAccount.address);
    } catch (err) {
        console.error(err);
    }

  }

  let borrower_add: string | undefined;
  if (activeWallet) {
    borrower_add = activeWallet?.activeAccount?.address;
  } else {
    alert('Connect wallet please')
  }

  async function addToDB() {
    const assetId = Number((document.getElementById('assetid') as HTMLInputElement).value)
    await sendTransfer();
    const { error: dbError } = await supabase
      .from('loandb')
      .insert({
        borrower_id: borrower_add,
        asset_id: assetId,
      });

    if (dbError) throw dbError;

  }

  // async function getAssetInfo(assetid: number) {
  //   try {
  //     const assetInfo = await algodClient.getAssetByID(assetid).do()
  //     return assetInfo.params.name;
  //   } catch (err) {
  //     return
  //   }
  // }
  // async function assetChecker(assetId: number) {
  //   getAssetInfo(assetId);
  // }

  // async function fetchLoans() {
  //   try {
  //     const { data, error } = await supabase.from('loandb').select('*').order('created_at')
  //     //@ts-ignore
  //     setLoans(data || []);
  //     if (error) throw error
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const getLoanDetails = () => {
  //   return loans;
  // }


  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-5 border-2 border-[#252525] p-8 rounded-4xl h-fit w-full mb-8 duration-300 ease-in-out hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[5px_5px_1px_0px_rgba(255,255,255)]">
        <button onClick={addToDB} className='border-2 border-[#252525] pt-2 pb-2 pr-4 pl-4 rounded-2xl cursor-pointer hover:bg-[#1f1f1f]'>Request Loan</button>
        <input id='assetid' placeholder='Asset-Id' type="number" className='border-2 border-[#252525] rounded-lg text-center' />
        {activeWallet?.activeAccount && (
          <div>
            <span>{activeWallet.activeAccount?.address}</span>
          </div>
        )}
        <div>Token Price : 5 </div>
        <div>Duration of Loan : 4 Days</div>
      </div>

      {/* <div className="flex flex-col items-center gap-5 p-8 rounded-4xl h-fit w-full">
        {getLoanDetails().map((loan) => {
          return (
            <div className="flex flex-row gap-8 justify-center items-center border-2 border-[#252525] p-8 rounded-4xl h-fit w-fit">
              <div className='text-[#ffffff]'>Asset Id : {loan.asset_id}</div>
              <div className='text-[#ffffff]'>{loan.price}</div>
              <button className='border-2 border-[#252525] pt-2 pb-2 pr-4 pl-4 rounded-2xl cursor-pointer hover:bg-[#1f1f1f]'>Approve</button>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}

export default LoanCreator
