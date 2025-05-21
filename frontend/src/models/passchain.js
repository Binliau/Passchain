import { ethers } from "ethers";
import abi from "../abi/PassChain.json";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Ganti sesuai hasil deploy

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");
  // Request account access if needed
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};