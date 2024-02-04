import { ethers } from "ethers";
import ERC721Factory from "../artifacts/contracts/ERC721Factory.sol/ERC721Factory.json";
import { program, Option } from "commander";
import * as dotenv from "dotenv";
dotenv.config();

function getRpcUrl(network: string): string {
  if (network == "polygon") {
    return process.env.POLYGON_URL ?? "";
  } else if (network == "sepolia") {
    return process.env.SEPOLIA_URL ?? "";
  } else {
    return "";
  }
}

function transactionExplorerUrl(network: string, txHash: string): string {
  if (network == "polygon") {
    return `https://polygonscan.com/tx/${txHash}`;
  } else if (network == "sepolia") {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  } else {
    return "";
  }
}

async function main(network: string, contractAddress: string, accountAddress: string, name: string, symbol: string) {
  const privateKey: string = process.env.PRIVATE_KEY ?? "";
  if (privateKey === "") {
    throw new Error("No value set for environement variable PRIVATE_KEY");
  }
  const rpcUrl: string = getRpcUrl(network);
  if (rpcUrl === "") {
    throw new Error("No value set for environement variable SEPOLIA_URL");
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, ERC721Factory.abi, signer);
  const tx = await contract.createERC721(name, symbol);
  const receipt = await tx.wait();
  const event = receipt.events?.find((e: any) => e.event === "ERC721Created");
  if (!event) throw new Error("ERC721Created event not found");

  const newContractAddress = event.args[0];
  console.log(`Deployed at ${newContractAddress}`);
  console.log(`Transaction URL: ${transactionExplorerUrl(network, tx.hash)}`);
}

program
  .addOption(
    new Option("--network <string>", "name of blockchain network(e.g. polygon, sepolia)")
      .choices(["polygon", "sepolia"])
      .makeOptionMandatory()
  )
  .addOption(new Option("--contractAddress <address>", "address of token contract").makeOptionMandatory())
  .addOption(new Option("--accountAddress <address>", "mint token to this account address").makeOptionMandatory())
  .addOption(new Option("--name <string>", "name of the collection").makeOptionMandatory())
  .addOption(new Option("--symbol <string>", "symbol of the collection").makeOptionMandatory())
  .parse();
const options = program.opts();

main(options.network, options.contractAddress, options.accountAddress, options.name, options.symbol).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
