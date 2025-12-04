import { test, expect } from './fixtures';
import { WidgetPage } from '../pages/widget-page';

test.describe('Nexus SDK React Widgets', () => {
    test.beforeEach(async ({ page, mockProvider }) => {
        // Enhance mock for approvals
        mockProvider.withArgs({ method: 'eth_sendTransaction' }).resolves('0xmocktxhash');
        await page.goto('./react-widget-test.html');
    });

    test('should render BridgeButton with prefill and handle click', async ({ widgetPage }) => {
        await widgetPage.assertPrefill(80002, 'USDC', '100');
        await widgetPage.openBridgeModal();
        await widgetPage.fillAndSubmitModal('100');  // Confirm prefill
        await widgetPage.assertLoadingState('bridge-btn', true);
        await widgetPage.page.waitForTimeout(1000);  // Simulate loading
        await widgetPage.assertLoadingState('bridge-btn', false);
        await widgetPage.assertTxSuccess();
    });

    test('should render TransferButton with prefill and execute transfer', async ({ widgetPage }) => {
        await widgetPage.assertPrefill(80002, 'USDC', '50');  // Partial, assumes shared selectors
        await widgetPage.getTransferButton().click();
        await expect(this.page.locator('.nexus-modal')).toBeVisible();
        await widgetPage.fillAndSubmitModal('50', '0x742d35Cc6634C0532925a3b8D7fB6969b37D7A4e');
        await widgetPage.assertTxSuccess();
    });

    test('should render BridgeAndExecuteButton and simulate full flow', async ({ widgetPage }) => {
        await widgetPage.getBridgeExecuteButton().click();
        await expect(widgetPage.page.locator('.nexus-modal')).toBeVisible();
        await widgetPage.fillAndSubmitModal('0.1');  // Amount for ETH
        await widgetPage.assertLoadingState('bridge-execute-btn', true);
        // Assert sequence: bridge → allowance → execute (mocked)
        const events = await widgetPage.page.evaluate(() => (window.sdkInstance as any).eventsFired);  // Assume tracked
        expect(events).toContain('BRIDGE_SUCCESS');
        expect(events).toContain('EXECUTE_SUCCESS');
        await widgetPage.assertTxSuccess();
    });

    test('should handle widget errors (e.g., invalid prefill)', async ({ widgetPage }) => {
        // Mock invalid token
        await widgetPage.page.evaluate(() => { window.sdkInstance.simulateError = true; });
        await expect(widgetPage.getBridgeButton().click()).rejects.toThrow('Invalid Token');
    });

    // Add more: Custom children rendering, event emissions, multi-chain prefill, etc.
});