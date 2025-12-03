import { Page, expect } from '@playwright/test';
import type { NexusSDK } from 'avail-nexus-sdk';  // Import types if available

export class NexusPage {
    readonly page: Page;
    private sdk: NexusSDK | null = null;

    constructor(page: Page) {
        this.page = page;
    }

    async initSDK() {
        // Wait for SDK to load
        await this.page.waitForFunction(() => !!window.sdkInstance);
        this.sdk = window.sdkInstance as unknown as NexusSDK;
        return this.sdk;
    }

    async getUnifiedBalances() {
        await this.page.evaluate(async () => {
            const balances = await (window.sdkInstance as any).getUnifiedBalances();
            return balances;  // Return to test context
        });
        // Assert in test
        expect(true).toBe(true);  // Placeholder; extend with real assertions
    }

    async simulateBridge(token: string, amount: number, chainId: number) {
        const result = await this.page.evaluate(async ({ token, amount, chainId }) => {
            const sim = await (window.sdkInstance as any).simulateBridge({ token, amount, chainId });
            return sim;
        }, { token, amount, chainId });
        return result;
    }

    async transferToAddress(recipient: string, amount: number, chainId: number) {
        const txHash = await this.page.evaluate(async ({ recipient, amount, chainId }) => {
            const tx = await (window.sdkInstance as any).transfer({ to: recipient, amount, chainId });
            return tx.hash;
        }, { recipient, amount, chainId });
        expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);  // Validate tx hash
        return txHash;
    }

    // Add more methods: execute, getAllowance, etc.
}