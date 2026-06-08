import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.ts'
import InventoryPage from '../pageobjects/inventory.page.ts'

describe('SauceDemo Login tests', () => {
    it('Valid Login with standard_user', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')
        await expect(InventoryPage.shoppingCartLink).toBeExisting()
    })

    it('Login with invalid password', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'wrong_password')
        const err = await $('#login_button_container .error-message-container')
        await expect(err).toBeExisting()
    })

    it('Login with locked_out_user shows error', async () => {
        await LoginPage.open()
        await LoginPage.login('locked_out_user', 'secret_sauce')
        const err = await $('#login_button_container .error-message-container')
        await expect(err).toBeExisting()
    })
})
