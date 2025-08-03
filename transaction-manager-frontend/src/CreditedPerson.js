import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import axios from 'axios';

const injectedConnector = new InjectedConnector({
  supportedChainIds: [11155111], // Sepolia's chain ID
});

function CreditedPerson() {
  const { activate, deactivate, account, active } = useWeb3React();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      await activate(injectedConnector);
      setMessage('Wallet connected!');
      fetchData();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessage('Failed to connect wallet.');
    }
  };

  const disconnectWallet = () => {
    deactivate();
    setMessage('Wallet disconnected.');
    setCredits(0);
    setTransactions([]);
  };

  const fetchData = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      // Fetch credits
      const creditsResponse = await axios.get(`http://localhost:5000/api/credits/${account}`);
      setCredits(ethers.utils.formatUnits(creditsResponse.data.credits, 0));
      
      // Fetch verified transactions where this account is the credited person
      const transactionsResponse = await axios.get('http://localhost:5000/api/transactions');
      const filteredTransactions = transactionsResponse.data.transactions.filter(
        tx => tx.creditedPerson.toLowerCase() === account.toLowerCase() && tx.verified
      );
      setTransactions(filteredTransactions);
      
      setMessage('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Failed to load data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active && account) {
      fetchData();
    }
  }, [active, account]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Credited Person Dashboard</h1>
      
      {/* Wallet Connection Section */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        {!active ? (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect MetaMask Wallet
          </button>
        ) : (
          <div>
            <p className="mb-2">Connected Account: <span className="font-mono">{account}</span></p>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>

      {/* Credits Display */}
      <div className="mb-6 p-6 border rounded-lg bg-green-50">
        <h2 className="text-xl font-semibold mb-2">Your Credits</h2>
        {loading ? (
          <p>Loading credits...</p>
        ) : (
          <p className="text-3xl font-bold">{credits} CRD</p>
        )}
      </div>

      {/* Transaction History */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Verified Transactions</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No verified transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`${tx.seller.substring(0, 6)}...${tx.seller.substring(38)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ethers.utils.formatUnits(tx.amount, 0)} CRD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.timestamp * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreditedPerson;
