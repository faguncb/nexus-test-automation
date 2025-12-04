import { test as base, expect } from '@playwright/test';
import { NexusPage } from '../pages/nexus-page';
import * as sinon from 'sinon';

export const test = base.extend<{ nexusPage: NexusPage; mockProvider: sinon.SinonStub }>({
    nexusPage: async ({ page }, use) => {
        const nexusPage = new NexusPage(page);
        await nexusPage.initSDK();
        await use(nexusPage);
    },
    widgetPage: async ({ page }, use) => {
        await page.goto('./react-widget-test.html');  // Relative to served dir
        await page.waitForFunction(() => !!window.sdkInstance && document.querySelector('#root'));
        const widgetPage = new WidgetPage(page);
        await use(widgetPage);
    },
    mockProvider: async ({}, use) => {
        const mock = sinon.stub(window.ethereum, 'request');
        mock.withArgs({ method: 'eth_getBalance' }).resolves('0x1');  // Mock 1 ETH balance
        await use(mock);
        mock.restore();
    },
    widgetPage: async ({ page }, use) => {
        const widgetPage = new WidgetPage(page);
        await widgetPage.page.waitForSelector('#bridge-btn');  // Ensure rendered
        await use(widgetPage);
    },
});


export { expect };