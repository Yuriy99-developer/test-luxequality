import { $ } from '@wdio/globals'
import Page from './page.ts';

class CartPage extends Page {
    public get checkoutButton() { return $('#checkout'); }
    public get cartItems() { return $$('.cart_item'); }

    public async openCart() {
        return super.open('cart.html');
    }
}

export default new CartPage();
