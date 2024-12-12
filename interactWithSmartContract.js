

const { ethers } = require("ethers");

let private_key = "0ecb54969fb205c948a56965c1e2bc23970e65897b092bb2787bd246cf419bcf";
let contractAddress = "0xe69e4d80605f21e4ef2af284410d75efe2ddc004";

const { abi } = require("./abi");


// Create a provider
const provider = new ethers.providers.JsonRpcProvider("https://polygon-amoy.g.alchemy.com/v2/R8alUv5e5htjl7yKk8MbIVlJdNw9OY32");



// Create wallet
const wallet = new ethers.Wallet(private_key, provider);

// Log wallet address to verify
console.log("Wallet Address:", wallet.address);

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Function to call the 'name' method
async function getWalletName() {
  try {
    const name = await contract.name();
    console.log("Wallet Name:", name);
  } catch (error) {
    console.error("Error calling 'name' method:", error);
  }
}

// Function to call the 'getValue' method
async function getValue() {
  try {
    const value = await contract.getValue();
    console.log("Stored Value :", value.toString());
   
  } catch (error) {
    console.error("Error calling 'getValue' method:", error);
  }
}

// Function to call the 'setValue' method (with value transfer)
async function setValue() {
  try {
    const valueToSet = 100; // Example value to set

    // Estimate the gas for the 'setValue' method
    const estimatedGas = await contract.estimateGas.setValue(valueToSet);
    console.log("Estimated Gas for setValue:", estimatedGas.toString());

    // Send the transaction
    const tx = await contract.setValue(valueToSet, {
      gasLimit: estimatedGas, // Set the estimated gas limit
      gasPrice: await provider.getGasPrice() // Get current gas price
    });
    console.log("Transaction Hash (setValue):", tx.hash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction mined!");
  } catch (error) {
    console.error("Error calling 'setValue' method:", error);
  }
}

// Function to call the 'sendEthContract' method
async function sendEthToContract() {
  try {
    // Estimate gas for sending ETH to contract
    const estimatedGas = await contract.estimateGas.sendEthContract({
      value: ethers.utils.parseEther("0.1"), // Send 0.1 ETH to the contract
    });
    console.log("Estimated Gas for sendEthContract:", estimatedGas.toString());

    // Send the transaction
    const tx = await contract.sendEthContract({
      value: ethers.utils.parseEther("0.1"),
      gasLimit: estimatedGas, // Set the estimated gas limit
      gasPrice: await provider.getGasPrice()
    });
    console.log("Transaction Hash (sendEthContract):", tx.hash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction mined!");
  } catch (error) {
    console.error("Error calling 'sendEthContract' method:", error);
  }
}

// Function to call the 'sendEthUser' method
async function sendEthToUser(address) {
  try {
    // Estimate gas for sending ETH to a user
    const estimatedGas = await contract.estimateGas.sendEthUser(address 
      , {
      value: ethers.utils.parseEther("0.05"), // Send 0.05 ETH to the specified address
    });
    console.log("Estimated Gas for sendEthUser:", estimatedGas.toString());

    // Send the transaction
    const tx = await contract.sendEthUser(address, {
      value: ethers.utils.parseEther("0.05"),
      gasLimit: estimatedGas, // Set the estimated gas limit
      gasPrice: await provider.getGasPrice()
    });
    console.log("Transaction Hash (sendEthUser):", tx.hash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction mined!");
  } catch (error) {
    console.error("Error calling 'sendEthUser' method:", error);
  }
}

// Function to call the 'accountBalance' method
async function getAccountBalance(userAddress) {
  try {
    const balance = await contract.accountBalance(userAddress);
    console.log("Account Balance of", userAddress, ":", ethers.utils.formatEther(balance), "ETH");
  } catch (error) {
    console.error("Error calling 'accountBalance' method:", error);
  }
}

// Example function calls
async function callSmartContractMethods() {
  await getWalletName();          // Call 'name' method
  await getValue();               // Call 'getValue' method
//   await setValue();               // Call 'setValue' method
//    await sendEthToContract();      // Call 'sendEthContract' method
  const userAddress = "0xe69e4d80605f21e4ef2af284410d75efe2ddc004"; // Replace with actual address
//   await sendEthToUser(userAddress);  // Call 'sendEthUser' method
  await getAccountBalance(userAddress);  // Call 'accountBalance' method
}

// Invoke the method calls
callSmartContractMethods();
