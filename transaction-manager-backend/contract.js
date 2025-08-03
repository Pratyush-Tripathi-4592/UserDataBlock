const { ethers } = require("ethers");
require("dotenv").config();

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "http://localhost:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001", provider);
const contractAddress = process.env.CONTRACT_ADDRESS;

// Contract ABI - this should be generated from the compiled contract
const contractABI = [
    "function proposeTransaction(address _creditedPerson, string _description, uint256 _amount) public",
    "function verifyTransaction(uint256 _id) public",
    "function rejectTransaction(uint256 _id) public",
    "function getTransaction(uint256 _id) public view returns (uint256 id, address seller, address creditedPerson, string description, uint256 amount, bool verified, bool exists)",
    "function getCredits(address _person) public view returns (uint256)"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function proposeTransaction(creditedPerson, description, amount) {
    try {
        const tx = await contract.proposeTransaction(creditedPerson, description, amount);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error proposing transaction:", error);
        throw error;
    }
}

async function verifyTransaction(id) {
    try {
        const tx = await contract.verifyTransaction(id);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error verifying transaction:", error);
        throw error;
    }
}

async function rejectTransaction(id) {
    try {
        const tx = await contract.rejectTransaction(id);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error rejecting transaction:", error);
        throw error;
    }
}

async function getTransaction(id) {
    try {
        return await contract.getTransaction(id);
    } catch (error) {
        console.error("Error getting transaction:", error);
        throw error;
    }
}

async function getCredits(person) {
    try {
        return await contract.getCredits(person);
    } catch (error) {
        console.error("Error getting credits:", error);
        throw error;
    }
}

module.exports = {
    proposeTransaction,
    verifyTransaction,
    rejectTransaction,
    getTransaction,
    getCredits,
};
