import {useContract} from './useContract';
import MyNFTAbi from '../contracts/MyNFT.json';
import MyNFTContractAddress from '../contracts/MyNFT-address.json';


// export interface for NFT contract
export const useMinterContract = () => useContract(MyNFTAbi.abi, MyNFTContractAddress.MyNFT);