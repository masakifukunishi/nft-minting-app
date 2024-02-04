import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const privateKey0: string = process.env.PRIVATE_KEY ?? "";
if (privateKey0 === "") {
  throw new Error("No value set for environement variable PRIVATE_KEY");
}

const sepoliaUrl: string = process.env.SEPOLIA_URL ?? "";
if (sepoliaUrl === "") {
  throw new Error("No value set for environement variable SEPOLIA_URL");
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: sepoliaUrl,
      accounts: [privateKey0],
      chainId: 11155111,
    },
  },
};

export default config;