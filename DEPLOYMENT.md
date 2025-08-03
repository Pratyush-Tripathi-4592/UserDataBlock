# Deployment Guide

This guide will walk you through deploying the UserDataBlock project to different environments.

## 🚀 Quick Deployment

### 1. Automated Setup
Run the automated setup script:
```bash
npm run setup
```

This will:
- Install all dependencies
- Compile contracts
- Run tests
- Create environment files

### 2. Local Development Deployment

#### Start Local Blockchain
```bash
npm run node
```

#### Deploy Contracts
In a new terminal:
```bash
npm run deploy
```

#### Start Backend
```bash
npm run start:backend
```

#### Start Frontend
```bash
npm run start:frontend
```

## 🌐 Production Deployment

### 1. Environment Configuration

Edit your `.env` file:
```env
# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here

# Contract Addresses (will be filled after deployment)
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
USER_DATA_STORAGE_ADDRESS=0x0000000000000000000000000000000000000000
TRANSACTION_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000

# Backend Configuration
PORT=5000
NODE_ENV=production

# Frontend Configuration
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_CHAIN_ID=11155111  # Sepolia testnet
```

### 2. Deploy Smart Contracts

#### Deploy to Testnet
```bash
npm run deploy:testnet
```

#### Deploy to Mainnet
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### 3. Update Environment Variables

After deployment, update your `.env` file with the deployed contract addresses.

### 4. Deploy Backend

#### Option A: Heroku
```bash
cd transaction-manager-backend
heroku create your-app-name
git add .
git commit -m "Deploy backend"
git push heroku main
```

#### Option B: Vercel
```bash
cd transaction-manager-backend
vercel
```

#### Option C: DigitalOcean App Platform
1. Connect your repository
2. Set environment variables
3. Deploy

### 5. Deploy Frontend

#### Option A: Vercel
```bash
cd transaction-manager-frontend
vercel
```

#### Option B: Netlify
```bash
cd transaction-manager-frontend
npm run build
# Upload dist folder to Netlify
```

#### Option C: GitHub Pages
```bash
cd transaction-manager-frontend
npm run build
# Configure GitHub Pages to serve from build folder
```

## 🔧 Configuration Details

### Hardhat Networks

Add these to your `hardhat.config.js`:

```javascript
networks: {
  hardhat: {
    chainId: 31337
  },
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337
  },
  sepolia: {
    url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    accounts: [process.env.PRIVATE_KEY]
  },
  mainnet: {
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### Environment Variables

#### Required Variables
- `PRIVATE_KEY`: Your wallet private key
- `SEPOLIA_RPC_URL`: RPC endpoint for Sepolia testnet
- `CONTRACT_ADDRESS`: Deployed contract address
- `PORT`: Backend server port

#### Optional Variables
- `NODE_ENV`: Environment (development/production)
- `REACT_APP_API_URL`: Backend API URL for frontend

## 🧪 Verification

### Verify Contract Deployment
```bash
npm run verify
```

### Test Contract Functions
```bash
npx hardhat run scripts/verify-deployment.js --network sepolia
```

## 🔒 Security Checklist

- [ ] Private keys are not committed to version control
- [ ] Environment variables are properly set
- [ ] Contracts are audited before mainnet deployment
- [ ] Access controls are properly configured
- [ ] Error handling is implemented
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] HTTPS is enabled in production

## 🆘 Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check private key format
   - Ensure sufficient funds for gas
   - Verify network connectivity

2. **Contract Verification Fails**
   - Check contract address
   - Verify network configuration
   - Ensure contract is deployed

3. **Backend Connection Issues**
   - Check environment variables
   - Verify CORS configuration
   - Check network connectivity

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify environment variables

### Support

For additional help:
1. Check the README.md file
2. Review the test files
3. Check the console for error messages
4. Verify network configuration 