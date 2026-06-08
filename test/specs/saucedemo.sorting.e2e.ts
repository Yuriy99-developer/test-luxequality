import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.ts'
import InventoryPage from '../pageobjects/inventory.page.ts'

describe('SauceDemo Sorting tests', () => {
    it('Verify sorting options work', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')

        // values: "az", "za", "lohi", "hilo" (depends on the site)
        const options = ['lohi', 'hilo', 'az', 'za']
        for (const opt of options) {
            await InventoryPage.selectSort(opt)
            const items = await InventoryPage.inventoryItems
            await expect(items.length).toBeGreaterThan(0)
        }
    })
})
