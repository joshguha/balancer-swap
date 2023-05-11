// 1) Set .env variables
// 2) Ensure Balancer Vault contract is approved for token in
// 3) Run script with: node index.js

const { ethers, Wallet, JsonRpcProvider, parseEther } = require("ethers");
const vaultABI = require("./abi/Vault.json");
const getEnvOrFail = require("./utils/getEnvOrFail");

// Config env variables
require("dotenv").config();
const rpcUrl = getEnvOrFail("RPC_URL");
const privateKey = getEnvOrFail("PRIVATE_KEY");

const VAULT_ADDRESS = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

const POOL_ID =
  "0xf0ad209e2e969eaaa8c882aac71f02d8a047d5c2000200000000000000000b49";
const ASSET_IN = "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4";
const ASSET_OUT = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

async function main() {
  try {
    // Set up Web3 ---------------------------------------
    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey).connect(provider);
    const user = await wallet.getAddress();
    // ---------------------------------------------------

    // Set up swap ---------------------------------------
    const singleSwap = {
      poolId: POOL_ID,
      kind: 0,
      assetIn: ASSET_IN,
      assetOut: ASSET_OUT,
      amount: parseEther("25"),
      userData: "0x",
    };

    const funds = {
      sender: user,
      recipient: user,
      fromInternalBalance: false,
      toInternalBalance: false,
    };

    const limit = 0;

    const deadline = Math.floor(Date.now() / 1000) * 2; // Very far in the future

    const vault = new ethers.Contract(VAULT_ADDRESS, vaultABI, wallet);

    const args = [singleSwap, funds, limit, deadline];

    const tx = await vault.swap(...args, { gasPrice: 200000000000 });
    console.log("Your Tx hash: " + tx.hash);
  } catch (e) {
    console.error(e);
  }
}

main().catch(() => process.exit(1));
