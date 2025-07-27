const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserDataStorage", function () {
  let userDataStorage;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy contract
    const UserDataStorage = await ethers.getContractFactory("UserDataStorage");
    userDataStorage = await UserDataStorage.deploy();
    await userDataStorage.waitForDeployment();
  });

  describe("Data Storage", function () {
    it("Should store user data correctly", async function () {
      const name = "John Doe";
      const email = "john@example.com";
      const age = 25;

      // Store data
      const tx = await userDataStorage.connect(user1).storeUserData(name, email, age);
      await tx.wait();

      // Retrieve data
      const userData = await userDataStorage.connect(user1).getMyData();
      
      expect(userData.length).to.equal(1);
      expect(userData[0].name).to.equal(name);
      expect(userData[0].email).to.equal(email);
      expect(userData[0].age).to.equal(age);
      expect(userData[0].userAddress).to.equal(user1.address);
    });

    it("Should increment total records", async function () {
      await userDataStorage.connect(user1).storeUserData("John", "john@test.com", 25);
      await userDataStorage.connect(user2).storeUserData("Jane", "jane@test.com", 30);

      const totalRecords = await userDataStorage.getTotalRecords();
      expect(totalRecords).to.equal(2);
    });

    it("Should emit DataStored event", async function () {
      const name = "Alice";
      const email = "alice@test.com";
      const age = 28;

      await expect(userDataStorage.connect(user1).storeUserData(name, email, age))
        .to.emit(userDataStorage, "DataStored")
        .withArgs(1, user1.address, name, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
    });

    it("Should reject invalid data", async function () {
      await expect(
        userDataStorage.connect(user1).storeUserData("", "email@test.com", 25)
      ).to.be.revertedWith("Name cannot be empty");

      await expect(
        userDataStorage.connect(user1).storeUserData("John", "", 25)
      ).to.be.revertedWith("Email cannot be empty");

      await expect(
        userDataStorage.connect(user1).storeUserData("John", "email@test.com", 0)
      ).to.be.revertedWith("Invalid age");
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
      // Add some test data
      await userDataStorage.connect(user1).storeUserData("John", "john@test.com", 25);
      await userDataStorage.connect(user1).storeUserData("John Updated", "john.new@test.com", 26);
      await userDataStorage.connect(user2).storeUserData("Jane", "jane@test.com", 30);
    });

    it("Should get user data by address", async function () {
      const userData = await userDataStorage.getUserData(user1.address);
      expect(userData.length).to.equal(2);
      expect(userData[0].name).to.equal("John");
      expect(userData[1].name).to.equal("John Updated");
    });

    it("Should get data by ID", async function () {
      const userData = await userDataStorage.getDataById(1);
      expect(userData.name).to.equal("John");
      expect(userData.email).to.equal("john@test.com");
      expect(userData.age).to.equal(25);
    });

    it("Should fail to get non-existent user data", async function () {
      const emptyAddress = "0x0000000000000000000000000000000000000000";
      await expect(
        userDataStorage.getUserData(emptyAddress)
      ).to.be.revertedWith("No data found for this user");
    });
  });

  describe("Data Updates", function () {
    beforeEach(async function () {
      await userDataStorage.connect(user1).storeUserData("John", "john@test.com", 25);
    });

    it("Should update user data", async function () {
      const newName = "John Smith";
      const newEmail = "johnsmith@test.com";
      const newAge = 26;

      await userDataStorage.connect(user1).updateUserData(1, newName, newEmail, newAge);

      const updatedData = await userDataStorage.getDataById(1);
      expect(updatedData.name).to.equal(newName);
      expect(updatedData.email).to.equal(newEmail);
      expect(updatedData.age).to.equal(newAge);
    });

    it("Should not allow unauthorized updates", async function () {
      await expect(
        userDataStorage.connect(user2).updateUserData(1, "Hacker", "hack@test.com", 99)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should emit DataUpdated event", async function () {
      const newName = "John Updated";
      await expect(userDataStorage.connect(user1).updateUserData(1, newName, "new@test.com", 26))
        .to.emit(userDataStorage, "DataUpdated")
        .withArgs(1, user1.address, newName, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
    });
  });
});