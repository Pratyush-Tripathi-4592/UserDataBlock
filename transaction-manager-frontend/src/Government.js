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

function Government() {
    const { activate, deactivate, account, library, active } = useWeb3React();
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');

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

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transactions');
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleVerifyTransaction = async (id) => {
        try {
            const response = await axios.post('http://localhost:5000/api/verify', { id });
            setMessage('Transaction verified successfully! Tx Hash: ' + response.data.txHash);
            fetchTransactions(); // Refresh transactions
        } catch (error) {
            console.error('Error verifying transaction:', error);
            setMessage('Failed to verify transaction. Check console for details.');
        }
    };

    const handleRejectTransaction = async (id) => {
        try {
            const response = await axios.post('http://localhost:5000/api/reject', { id });
            setMessage('Transaction rejected successfully! Tx Hash: ' + response.data.txHash);
            fetchTransactions(); // Refresh transactions
        } catch (error) {
            console.error('Error rejecting transaction:', error);
            setMessage('Failed to reject transaction. Check console for details.');
        }
    };

    useEffect(() => {
        if (active && account) {
            fetchTransactions();
        }
    }, [active, account]);

    return (
        <div>
            <h2>Government Interface</h2>
            {!active ? (
                <button onClick={connectWallet}>Connect MetaMask</button>
            ) : (
                <div>
                    <p>Connected Account: {account}</p>
                    <button onClick={disconnectWallet}>Disconnect Wallet</button>
                    <h3>Proposed Transactions</h3>
                    {transactions.length === 0 ? (
                        <p>No transactions proposed yet.</p>
                    ) : (
                        <ul>
                            {transactions.map((tx) => (
                                <li key={tx.id}>
                                    ID: {tx.id}, Description: {tx.description}, Amount: {tx.amount}, Verified: {tx.verified ? 'Yes' : 'No'}
                                    <button onClick={() => handleVerifyTransaction(tx.id)}>Verify</button>
                                    <button onClick={() => handleRejectTransaction(tx.id)}>Reject</button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export default Government;
