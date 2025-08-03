const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying deployment...");
  
  // Get signers
  const [deployer, user1, user2] = await ethers.getSigners();
  
  // Contract addresses (you'll need to update these after deployment)
  const userDataStorageAddress = process.env.USER_DATA_STORAGE_ADDRESS;
  const transactionManagerAddress = process.env.TRANSACTION_MANAGER_ADDRESS;
  
  if (!userDataStorageAddress || !transactionManagerAddress) {
    console.error("❌ Contract addresses not found in environment variables");
    console.log("Please set USER_DATA_STORAGE_ADDRESS and TRANSACTION_MANAGER_ADDRESS");
    return;
  }
  
  try {
    // Get contract instances
    const UserDataStorage = await ethers.getContractFactory("UserDataStorage");
    const TransactionManager = await ethers.getContractFactory("TransactionManager");
    
    const userDataStorage = UserDataStorage.attach(userDataStorageAddress);
    const transactionManager = TransactionManager.attach(transactionManagerAddress);
    
    console.log("📋 Contract Addresses:");
    console.log("UserDataStorage:", userDataStorageAddress);
    console.log("TransactionManager:", transactionManagerAddress);
    
    // Test UserDataStorage functionality
    console.log("\n🧪 Testing UserDataStorage...");
    
    // Store user data
    const tx1 = await userDataStorage.connect(user1).storeUserData(
      "John Doe",
      "john@example.com",
      25
    );
    await tx1.wait();
    console.log("✅ User data stored successfully");
    
    // Retrieve user data
    const userData = await userDataStorage.connect(user1).getMyData();
    console.log("✅ User data retrieved:", userData[0].name);
    
    // Test TransactionManager functionality
    console.log("\n🧪 Testing TransactionManager...");
    
    // Propose transaction
    const tx2 = await transactionManager.connect(user1).proposeTransaction(
      user2.address,
      "Test transaction",
      100
    );
    await tx2.wait();
    console.log("✅ Transaction proposed successfully");
    
    // Get transaction
    const transaction = await transactionManager.getTransaction(1);
    console.log("✅ Transaction retrieved:", transaction.description);
    
    // Verify transaction (as government)
    const tx3 = await transactionManager.connect(deployer).verifyTransaction(1);
    await tx3.wait();
    console.log("✅ Transaction verified successfully");
    
    // Check credits
    const credits = await transactionManager.getCredits(user2.address);
    console.log("✅ Credits awarded:", credits.toString());
    
    console.log("\n🎉 All tests passed! Deployment is working correctly.");
    
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 