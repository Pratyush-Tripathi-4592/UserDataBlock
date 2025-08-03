const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy UserDataStorage contract
  console.log("\nDeploying UserDataStorage contract...");
  const UserDataStorage = await ethers.getContractFactory("UserDataStorage");
  const userDataStorage = await UserDataStorage.deploy();
  await userDataStorage.waitForDeployment();
  const userDataStorageAddress = await userDataStorage.getAddress();
  console.log("UserDataStorage deployed to:", userDataStorageAddress);

  // Deploy TransactionManager contract
  console.log("\nDeploying TransactionManager contract...");
  const TransactionManager = await ethers.getContractFactory("TransactionManager");
  // Use deployer address as government address for testing
  const transactionManager = await TransactionManager.deploy(deployer.address);
  await transactionManager.waitForDeployment();
  const transactionManagerAddress = await transactionManager.getAddress();
  console.log("TransactionManager deployed to:", transactionManagerAddress);

  // Verify deployments by calling read functions
  console.log("\nVerifying deployments...");
  const totalRecords = await userDataStorage.getTotalRecords();
  console.log("Initial total records:", totalRecords.toString());

  const governmentAddress = await transactionManager.governmentAddress();
  console.log("Government address:", governmentAddress);

  // Save deployment addresses to a file for easy access
  const deploymentInfo = {
    userDataStorage: userDataStorageAddress,
    transactionManager: transactionManagerAddress,
    deployer: deployer.address,
    network: network.name,
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("UserDataStorage:", userDataStorageAddress);
  console.log("TransactionManager:", transactionManagerAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);

  return deploymentInfo;
}

// Handle errors
main()
  .then((deploymentInfo) => {
    console.log("\n✅ Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });