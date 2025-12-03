import { test as base, expect } from '@playwright/test';
import { NexusPage } from '../pages/nexus-page';
import * as sinon from 'sinon';

export const test = base.extend<{ nexusPage: NexusPage; mockProvider: sinon.SinonStub }>({
    nexusPage: async ({ page }, use) => {
        const nexusPage = new NexusPage(page);
        await nexusPage.initSDK();
        await use(nexusPage);
    },
    mockProvider: async ({}, use) => {
        const mock = sinon.stub(window.ethereum, 'request');
        mock.withArgs({ method: 'eth_getBalance' }).resolves('0x1');  // Mock 1 ETH balance
        await use(mock);
        mock.restore();
    },
});

export { expect };