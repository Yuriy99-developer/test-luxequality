import { $ } from '@wdio/globals'
import Page from './page.ts';

class CheckoutPage extends Page {
    public get firstName() { return $('#first-name'); }
    public get lastName() { return $('#last-name'); }
    public get postalCode() { return $('#postal-code'); }
    public get continueButton() { return $('#continue'); }
    public get finishButton() { return $('#finish'); }

    public async fillCheckoutForm(first: string, last: string, postal: string) {
        await this.firstName.setValue(first);
        await this.lastName.setValue(last);
        await this.postalCode.setValue(postal);
    }

    public open() {
        return super.open('checkout-step-one.html');
    }
}

export default new CheckoutPage();
