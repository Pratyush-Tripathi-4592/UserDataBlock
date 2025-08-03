# UserDataBlock - Blockchain User Data Storage System

A comprehensive blockchain-based system for storing user data and managing transactions with government verification.

## 🏗️ Project Structure

```
UserDataBlock/
├── contracts/                    # Smart contracts
│   ├── UserDataStorage.sol      # User data storage contract
│   ├── TransactionManager.sol   # Transaction management contract
│   └── Lock.sol                 # Example lock contract
├── transaction-manager-backend/  # Backend API server
├── transaction-manager-frontend/ # React frontend application
├── scripts/                     # Deployment scripts
├── test/                        # Contract tests
└── hardhat.config.js           # Hardhat configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or similar Web3 wallet

### 1. Install Dependencies

```bash
# Install root dependencies (Hardhat, contracts)
npm install

# Install backend dependencies
cd transaction-manager-backend
npm install

# Install frontend dependencies
cd ../transaction-manager-frontend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here

# Backend Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHAIN_ID=31337
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy Contracts

#### Local Development
```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy contracts
npm run deploy
```

#### Testnet Deployment
```bash
npm run deploy:testnet
```

### 6. Start Backend Server

```bash
cd transaction-manager-backend
npm start
```

### 7. Start Frontend Application

```bash
cd transaction-manager-frontend
npm start
```

## 📋 Available Scripts

### Root Directory
- `npm run compile` - Compile smart contracts
- `npm test` - Run contract tests
- `npm run deploy` - Deploy to local network
- `npm run deploy:testnet` - Deploy to testnet
- `npm run node` - Start local Hardhat node
- `npm run clean` - Clean build artifacts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🔧 Configuration

### Hardhat Configuration
The project uses Hardhat for smart contract development. Configuration is in `hardhat.config.js`.

### Network Configuration
- **Localhost**: `http://127.0.0.1:8545` (Chain ID: 31337)
- **Sepolia**: Configure with your Infura/Alchemy endpoint

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The test suite covers:
- Contract deployment
- User data storage and retrieval
- Transaction management
- Access control
- Event emissions

## 📦 Deployment

### Local Development
1. Start Hardhat node: `npm run node`
2. Deploy contracts: `npm run deploy`
3. Update environment variables with deployed addresses
4. Start backend: `cd transaction-manager-backend && npm start`
5. Start frontend: `cd transaction-manager-frontend && npm start`

### Production Deployment
1. Configure environment variables for production network
2. Deploy contracts: `npm run deploy:testnet`
3. Update environment variables with deployed addresses
4. Build frontend: `cd transaction-manager-frontend && npm run build`
5. Deploy backend and frontend to your hosting platform

## 🔒 Security Considerations

- Never commit private keys to version control
- Use environment variables for sensitive data
- Regularly audit smart contracts
- Test thoroughly before mainnet deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Metamask Connection Issues**
   - Ensure you're connected to the correct network
   - Check if the network is added to MetaMask

2. **Contract Deployment Fails**
   - Verify your private key is correct
   - Ensure you have sufficient funds for gas
   - Check network connectivity

3. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for dependency conflicts

4. **Backend Connection Issues**
   - Verify the backend is running on the correct port
   - Check CORS configuration
   - Ensure environment variables are set correctly
