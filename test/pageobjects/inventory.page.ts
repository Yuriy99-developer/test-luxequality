import { $$, $, browser } from '@wdio/globals'
import Page from './page.js';

class InventoryPage extends Page {
    public get inventoryItems() { return $$('.inventory_item'); }
    public get firstAddToCartButton() { return $('button[id^="add-to-cart-"]'); }
    public get shoppingCartLink() { return $('.shopping_cart_link'); }
    public get cartBadge() { return $('.shopping_cart_badge'); }
    public get menuButton() { return $('#react-burger-menu-btn'); }
    public get logoutLink() { return $('#logout_sidebar_link'); }
    public get sortSelect() { return $('select.product_sort_container'); }

    public async addFirstProductToCart() {
        const items = await this.inventoryItems
        if (!items || items.length === 0) throw new Error('No inventory items found')
        const first = items[0]
        const btn = await first.$('button')
        await btn.waitForExist({ timeout: 5000 })
        try {
            await btn.scrollIntoView()
        } catch {}
        try {
            await btn.moveTo()
        } catch {}
        try {
            await btn.waitForClickable({ timeout: 5000 })
            await btn.click()
            return
        } catch (err) {}
        // fallback: click via DOM using index or id to avoid passing element handles
        const id = await btn.getAttribute('id')
        if (id) {
            const script = `(function(){const el=document.getElementById(${JSON.stringify(id)}); if(el) el.click();})()`
            await browser.execute(script)
            return
        }
        const script = `(function(){const rows=document.querySelectorAll('.inventory_item'); const row=rows[0]; if(!row) return; const b=row.querySelector('button'); if(b) b.click();})()`
        await browser.execute(script)
    }

    public async openMenu() {
        await (await this.menuButton).click();
    }

    public async logout() {
        await this.openMenu();
        await (await this.logoutLink).click();
    }

    public async selectSort(optionValue: string) {
        await (await this.sortSelect).selectByAttribute('value', optionValue);
    }

    public open() {
        return super.open('');
    }
}

export default new InventoryPage();
