import { 
  WalletManager, 
  WalletId,
  NetworkId, 
} from '@txnlab/use-wallet';


const endpoint: string = 'https://testnet-api.algonode.cloud';
export const manager = new WalletManager({
    wallets: [WalletId.EXODUS,WalletId.PERA,WalletId.DEFLY], 
    networks: {
      [NetworkId.TESTNET]: {
        algod: {
          baseServer: endpoint,
          token: '',
          port: ''
        }
      }
    },
      defaultNetwork: NetworkId.TESTNET, 
  })