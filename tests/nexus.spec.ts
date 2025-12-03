import { test, expect } from './fixtures';
import { NexusPage } from '../pages/nexus-page';

test.describe('Avail Nexus SDK E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test-page.html');  // Navigates to our test page
    });

    test('should initialize SDK and fetch unified balances', async ({ nexusPage, mockProvider }) => {
        const balances = await nexusPage.page.evaluate(() => (window.sdkInstance as any).getUnifiedBalances());
        expect(balances).toBeDefined();
        expect(balances.length).toBeGreaterThan(0);  // At least one chain balance
        expect(mockProvider.called).toBeTruthy();  // Verify mock usage
    });

    test('should simulate a token bridge successfully', async ({ nexusPage }) => {
        const simResult = await nexusPage.simulateBridge('USDC', 100, 80002);  // Polygon Amoy
        expect(simResult).toHaveProperty('gasEstimate');
        expect(simResult).toHaveProperty('cost');
    });

    test('should perform a direct transfer on testnet', async ({ nexusPage }) => {
        const recipient = '0x742d35Cc6634C0532925a3b8D7fB6969b37D7A4e';  // Test address
        const txHash = await nexusPage.transferToAddress(recipient, 10, 80002);
        console.log('Transfer TX Hash:', txHash);  // Log for verification
        expect(txHash).toBeTruthy();
    });

    test('should handle allowance management', async ({ nexusPage }) => {
        const allowance = await nexusPage.page.evaluate(async () => {
            const allow = await (window.sdkInstance as any).getAllowance(80002, ['USDC']);
            return allow;
        });
        expect(allowance).toBeDefined();
    });

    // Add more tests: bridgeAndExecute, event listeners, React widget rendering, etc.
});