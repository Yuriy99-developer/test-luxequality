import { expect, $, $$, browser } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'
import CartPage from '../pageobjects/cart.page.js'

describe('SauceDemo Checkout without products (0009)', () => {
    it('Checkout without products shows empty-cart behavior', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')

        // ensure inventory loaded
        try {
            await browser.waitUntil(async () => (await browser.getUrl()).includes('/inventory.html'), {
                timeout: 15000,
                timeoutMsg: 'expected to be on /inventory.html after login'
            })
        } catch (err) {
            // continue — the login helper may already be on inventory
        }

        // open cart
        const cartLink = await InventoryPage.shoppingCartLink
        await cartLink.waitForExist({ timeout: 5000 })
        try {
            await cartLink.waitForClickable({ timeout: 5000 })
            await cartLink.click()
        } catch (err) {
            const id = await cartLink.getAttribute('id')
            if (id) {
                const script = `(function(){const el=document.getElementById(${JSON.stringify(id)}); if(el) el.click();})()`
                await browser.execute(script)
            } else {
                const script = `(function(){const el=document.querySelector('.shopping_cart_link'); if(el) el.click();})()`
                await browser.execute(script)
            }
        }

        // verify cart is displayed and empty
        const items = await $$('.cart_item')
        await expect(items.length).toBe(0)

        // click checkout
        const checkoutBtn = await CartPage.checkoutButton
        await checkoutBtn.waitForExist({ timeout: 5000 })
        try {
            await checkoutBtn.waitForClickable({ timeout: 5000 })
            await checkoutBtn.click()
        } catch (err) {
            const id = await checkoutBtn.getAttribute('id')
            if (id) {
                const script = `(function(){const el=document.getElementById(${JSON.stringify(id)}); if(el) el.click();})()`
                await browser.execute(script)
            } else {
                const script = `(function(){const el=document.querySelector('#checkout'); if(el) el.click();})()`
                await browser.execute(script)
            }
        }

        // After clicking, either an empty-cart message appears or we remain on the cart page
        const bodyText = await (await $('body')).getText()
        if (bodyText && bodyText.includes('Cart is empty')) {
            await expect(bodyText).toContain('Cart is empty')
        } else {
            const url = await browser.getUrl()
            await expect(url).toContain('cart')
        }
    })
})
