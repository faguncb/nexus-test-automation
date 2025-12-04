// Simple mock for window.ethereum using ethers
const { ethers } = require('ethers');  // Loaded via script in HTML

window.ethereum = {
    isMetaMask: true,
    request: async ({ method, params }) => {
        if (method === 'eth_requestAccounts') return ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'];  // Mock account
        if (method === 'eth_chainId') return '0x13882';  // Polygon Amoy (80002)
        if (method === 'eth_accounts') return ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'];
        if (method === 'eth_sendTransaction') {
            // Mock successful tx for bridge/transfer/execute
            return '0x' + '1234567890abcdef'.repeat(8);  // Mock tx hash
        }
        if (method === 'eth_estimateGas') return '21000';  // Mock gas
        throw new Error(`Unmocked: ${method}`);
    },
    enable: async () => ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'],  // For connection
    selectedAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
};

// Stub ethers for balance mocks (injected per test)