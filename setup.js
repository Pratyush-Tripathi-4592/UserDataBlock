#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up UserDataBlock project...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    log(`Running: ${command}`, 'blue');
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Failed to run: ${command}`, 'red');
    return false;
  }
}

// Check if .env file exists
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    log('⚠️  .env file not found. Creating from template...', 'yellow');
    if (fs.existsSync('env.example')) {
      fs.copyFileSync('env.example', '.env');
      log('✅ .env file created from template', 'green');
      log('📝 Please edit .env file with your configuration', 'yellow');
    } else {
      log('❌ env.example not found', 'red');
    }
  } else {
    log('✅ .env file already exists', 'green');
  }
}

// Install dependencies
function installDependencies() {
  log('\n📦 Installing dependencies...', 'blue');
  
  // Root dependencies
  log('Installing root dependencies...', 'blue');
  if (!runCommand('npm install')) {
    log('❌ Failed to install root dependencies', 'red');
    return false;
  }
  
  // Backend dependencies
  log('Installing backend dependencies...', 'blue');
  if (!runCommand('npm install', path.join(process.cwd(), 'transaction-manager-backend'))) {
    log('❌ Failed to install backend dependencies', 'red');
    return false;
  }
  
  // Frontend dependencies
  log('Installing frontend dependencies...', 'blue');
  if (!runCommand('npm install', path.join(process.cwd(), 'transaction-manager-frontend'))) {
    log('❌ Failed to install frontend dependencies', 'red');
    return false;
  }
  
  log('✅ All dependencies installed successfully', 'green');
  return true;
}

// Compile contracts
function compileContracts() {
  log('\n🔨 Compiling smart contracts...', 'blue');
  if (runCommand('npm run compile')) {
    log('✅ Contracts compiled successfully', 'green');
    return true;
  } else {
    log('❌ Contract compilation failed', 'red');
    return false;
  }
}

// Run tests
function runTests() {
  log('\n🧪 Running tests...', 'blue');
  if (runCommand('npm test')) {
    log('✅ All tests passed', 'green');
    return true;
  } else {
    log('❌ Tests failed', 'red');
    return false;
  }
}

// Main setup function
function main() {
  log('UserDataBlock Setup Script', 'blue');
  log('==========================\n', 'blue');
  
  // Check environment
  checkEnvFile();
  
  // Install dependencies
  if (!installDependencies()) {
    log('\n❌ Setup failed at dependency installation', 'red');
    process.exit(1);
  }
  
  // Compile contracts
  if (!compileContracts()) {
    log('\n❌ Setup failed at contract compilation', 'red');
    process.exit(1);
  }
  
  // Run tests
  if (!runTests()) {
    log('\n❌ Setup failed at testing', 'red');
    process.exit(1);
  }
  
  log('\n🎉 Setup completed successfully!', 'green');
  log('\n📋 Next steps:', 'blue');
  log('1. Edit .env file with your configuration', 'yellow');
  log('2. Start local Hardhat node: npm run node', 'yellow');
  log('3. Deploy contracts: npm run deploy', 'yellow');
  log('4. Start backend: npm run start:backend', 'yellow');
  log('5. Start frontend: npm run start:frontend', 'yellow');
  log('\n📖 For more information, see README.md', 'blue');
}

// Run setup
main(); 