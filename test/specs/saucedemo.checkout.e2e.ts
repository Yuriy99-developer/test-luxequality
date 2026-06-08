import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.ts'
import InventoryPage from '../pageobjects/inventory.page.ts'
import CheckoutPage from '../pageobjects/checkout.page.ts'

describe('SauceDemo Checkout tests', () => {
    it('Valid Checkout flow', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')
        await InventoryPage.addFirstProductToCart()
        await (await InventoryPage.shoppingCartLink).click()
        const checkoutBtn = await $('#checkout')
        await checkoutBtn.waitForExist({ timeout: 5000 })
        await checkoutBtn.click()

        await CheckoutPage.fillCheckoutForm('John', 'Doe', '12345')
        await (await CheckoutPage.continueButton).click()
        await (await CheckoutPage.finishButton).click()

        const completeHeader = await $('h2.complete-header')
        await expect(completeHeader).toBeExisting()
    })
})
