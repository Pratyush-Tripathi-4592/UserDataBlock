const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require("./TransactionManager.json").abi; // Ensure you have the ABI file

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function proposeTransaction(creditedPerson, description, amount) {
    const tx = await contract.proposeTransaction(creditedPerson, description, amount);
    await tx.wait();
    return tx.hash;
}

async function verifyTransaction(id) {
    const tx = await contract.verifyTransaction(id);
    await tx.wait();
    return tx.hash;
}

async function rejectTransaction(id) {
    const tx = await contract.rejectTransaction(id);
    await tx.wait();
    return tx.hash;
}

async function getTransaction(id) {
    return await contract.getTransaction(id);
}

async function getCredits(person) {
    return await contract.getCredits(person);
}

module.exports = {
    proposeTransaction,
    verifyTransaction,
    rejectTransaction,
    getTransaction,
    getCredits,
};
