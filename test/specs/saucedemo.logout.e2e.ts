import { expect, browser } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'

describe('SauceDemo Logout tests', () => {
    it('Logout returns to login page and clears fields', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')

        // ensure inventory menu is available
        await (await InventoryPage.menuButton).waitForExist({ timeout: 5000 })

        // perform logout via JS click (robust across Puppeteer issues)
        await InventoryPage.openMenu()
        const logoutEl = await InventoryPage.logoutLink
        await logoutEl.waitForExist({ timeout: 5000 })
        // try direct clickable API first, but fallback to DOM script click which is more reliable
        try {
            await logoutEl.waitForClickable({ timeout: 2000 })
            await logoutEl.click()
        } catch {
            const id = await logoutEl.getAttribute('id')
            const script = id
                ? `(function(){const el=document.getElementById(${JSON.stringify(id)}); if(el) el.click();})()`
                : `(function(){const el=document.querySelector('#logout_sidebar_link'); if(el) el.click();})()`
            try {
                await browser.execute(script)
            } catch (e: any) {
                // last resort: dispatch mouse events
                const script2 = `(function(){const el=document.querySelector('#logout_sidebar_link'); if(!el) return; const ev=new MouseEvent('click',{bubbles:true,cancelable:true}); el.dispatchEvent(ev);})()`
                await browser.execute(script2)
            }
        }

        // verify login page is shown and inputs are empty
        await (await LoginPage.inputUsername).waitForExist({ timeout: 5000 })
        await expect(LoginPage.inputUsername).toBeExisting()
        await expect(LoginPage.inputPassword).toBeExisting()

        const usernameValue = await (await LoginPage.inputUsername).getValue()
        const passwordValue = await (await LoginPage.inputPassword).getValue()

        await expect(usernameValue).toBe('')
        await expect(passwordValue).toBe('')
    })
})
