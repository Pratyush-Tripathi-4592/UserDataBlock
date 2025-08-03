import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import axios from 'axios';

const injectedConnector = new InjectedConnector({
    supportedChainIds: [11155111], // Sepolia's chain ID
});

function getLibrary(provider) {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}

function Seller() {
    const { activate, deactivate, account, library, active } = useWeb3React();
    const [creditedPerson, setCreditedPerson] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [transactions, setTransactions] = useState([]);

    const connectWallet = async () => {
        try {
            await activate(injectedConnector);
            setMessage('Wallet connected!');
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setMessage('Failed to connect wallet.');
        }
    };

    const disconnectWallet = () => {
        deactivate();
        setMessage('Wallet disconnected.');
    };

    const handleProposeTransaction = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/propose', {
                creditedPerson,
                description,
                amount: ethers.utils.parseUnits(amount, 0).toString(), // Assuming amount is in base units (e.g., credits)
            });
            setMessage('Transaction proposed successfully! Tx Hash: ' + response.data.txHash);
            setCreditedPerson('');
            setDescription('');
            setAmount('');
            fetchSellerTransactions(); // Refresh transactions
        } catch (error) {
            console.error('Error proposing transaction:', error);
            setMessage('Failed to propose transaction. Check console for details.');
        }
    };

    const fetchSellerTransactions = async () => {
        if (!account) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/credits/${account}`);
            setTransactions(response.data.credits);
        } catch (error) {
            console.error('Error fetching seller transactions:', error);
        }
    };

    useEffect(() => {
        if (active && account) {
            fetchSellerTransactions();
        }
    }, [active, account]);

    return (
        <div>
            <h2>Seller Interface</h2>
            {!active ? (
                <button onClick={connectWallet}>Connect MetaMask</button>
            ) : (
                <div>
                    <p>Connected Account: {account}</p>
                    <button onClick={disconnectWallet}>Disconnect Wallet</button>
                    <h3>Propose New Transaction</h3>
                    <input
                        type="text"
                        value={creditedPerson}
                        onChange={(e) => setCreditedPerson(e.target.value)}
                        placeholder="Credited Person Address"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Transaction Description"
                    />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount (Credits)"
                    />
                    <button onClick={handleProposeTransaction}>Propose Transaction</button>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export default Seller;
