import { expect, $, $$, browser } from '@wdio/globals'
import fs from 'fs'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('SauceDemo Cart tests', () => {
    it('Saving the cart after logout', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')
        await InventoryPage.addFirstProductToCart()
        await expect(InventoryPage.cartBadge).toBeExisting()

        await InventoryPage.openMenu()
        const logoutEl = await InventoryPage.logoutLink
        await logoutEl.waitForExist({ timeout: 5000 })
        try {
            await logoutEl.waitForClickable({ timeout: 5000 })
            await logoutEl.click()
        } catch (err) {
            const id = await logoutEl.getAttribute('id')
            if (id) {
                const script = `(function(){const el=document.getElementById(${JSON.stringify(id)}); if(el) el.click();})()`
                await browser.execute(script)
            } else {
                const script = `(function(){const el=document.querySelector('#logout_sidebar_link'); if(el) el.click();})()`
                await browser.execute(script)
            }
        }

        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')
        // wait for the app to navigate to inventory (don't force navigation — it can break session)
        try {
            await browser.waitUntil(async () => (await browser.getUrl()).includes('/inventory.html'), {
                timeout: 20000,
                timeoutMsg: 'expected to be on /inventory.html after login'
            })
            await (await InventoryPage.firstAddToCartButton).waitForExist({ timeout: 20000 })
        } catch (err) {
            const url = await browser.getUrl()
            console.log('DEBUG: URL after login ->', url)
            // try to save full HTML via element API (more robust with DevTools)
            try {
                const html = await (await $('html')).getHTML(false as any)
                const dir = './debug'
                try { fs.mkdirSync(dir, { recursive: true }) } catch (e) { }
                const file = `${dir}/html-after-login-${Date.now()}.html`
                fs.writeFileSync(file, html)
                console.log('DEBUG: saved HTML to', file)
            } catch (e: any) {
                console.log('DEBUG: failed to save HTML ->', e && e.message)
            }

            // try to collect performance entries (resources loaded)
            try {
                const perf = await browser.execute(() => { try { return performance.getEntries() } catch (e) { return null } })
                if (perf) {
                    const dir = './debug'
                    try { fs.mkdirSync(dir, { recursive: true }) } catch (e) { }
                    const file = `${dir}/perf-after-login-${Date.now()}.json`
                    fs.writeFileSync(file, JSON.stringify(perf, null, 2))
                    console.log('DEBUG: saved performance entries to', file)
                }
            } catch (e: any) {
                console.log('DEBUG: failed to save perf entries ->', e && e.message)
            }

            throw err
        }
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
        const items = await $$('.cart_item')
        await expect(items.length).toBeGreaterThan(0)
    })
})
