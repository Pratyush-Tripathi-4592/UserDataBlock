const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying UserDataStorage contract...");
  
  // Get the contract factory
  const UserDataStorage = await ethers.getContractFactory("UserDataStorage");
  
  // Deploy the contract
  const userDataStorage = await UserDataStorage.deploy();
  
  // Wait for deployment to finish
  await userDataStorage.waitForDeployment();
  
  const contractAddress = await userDataStorage.getAddress();
  
  console.log("UserDataStorage deployed to:", contractAddress);
  console.log("Transaction hash:", userDataStorage.deploymentTransaction().hash);
  
  // Verify deployment by calling a read function
  const totalRecords = await userDataStorage.getTotalRecords();
  console.log("Initial total records:", totalRecords.toString());
  
  return contractAddress;
}

// Handle errors
main()
  .then((contractAddress) => {
    console.log("Deployment successful!");
    console.log("Contract address:", contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });