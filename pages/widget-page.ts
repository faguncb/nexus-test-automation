import { Page, Locator, expect } from '@playwright/test';

export class WidgetPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getBridgeButton(): Locator { return this.page.locator('#bridge-btn'); }
    getTransferButton(): Locator { return this.page.locator('#transfer-btn'); }
    getBridgeExecuteButton(): Locator { return this.page.locator('#bridge-execute-btn'); }

    async openBridgeModal() {
        await this.getBridgeButton().click();
        await expect(this.page.locator('.nexus-modal')).toBeVisible();  // Assume modal class
    }

    async fillAndSubmitModal(amount: string, recipient?: string) {
        await this.page.fill('[data-testid="amount-input"]', amount);
        if (recipient) await this.page.fill('[data-testid="recipient-input"]', recipient);
        await this.page.click('[data-testid="submit-btn"]');
    }

    async assertPrefill(chainId: number, token: string, amount: string) {
        await expect(this.page.locator('[data-testid="chain-select"]')).toHaveValue(chainId.toString());
        await expect(this.page.locator('[data-testid="token-select"]')).toHaveValue(token);
        await expect(this.page.locator('[data-testid="amount-input"]')).toHaveValue(amount);
    }

    async assertLoadingState(buttonId: string, isLoading: boolean) {
        const button = this.page.locator(`#${buttonId}`);
        await expect(button).toHaveAttribute('disabled', isLoading ? '' : null);
        await expect(button).toContainText(isLoading ? 'ing...' : 'Button Text');  // Partial match
    }

    async assertTxSuccess() {
        const txHash = await this.page.evaluate(() => (window.sdkInstance as any).lastTxHash);  // Assume SDK exposes last tx
        expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    }
}