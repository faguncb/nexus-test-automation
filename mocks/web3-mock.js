// Simple mock for window.ethereum using ethers
const { ethers } = require('ethers');  // Loaded via script in HTML

window.ethereum = {
    isMetaMask: true,
    request: async ({ method, params }) => {
        if (method === 'eth_requestAccounts') return ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'];  // Mock account
        if (method === 'eth_chainId') return '0x13882';  // Polygon Amoy (80002)
        if (method === 'eth_accounts') return ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'];
        // Add more mocks for balances, approvals, etc., using sinon in tests
        throw new Error(`Unmocked method: ${method}`);
    },
    on: (event, callback) => { /* Mock listeners */ },
    removeListener: () => { /* */ },
};

// Stub ethers for balance mocks (injected per test)