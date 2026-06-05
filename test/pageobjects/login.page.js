import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    get username() { return $('#username') }
    get password() { return $('#password') }
    get submitBtn() { return $('form button[type="submit"]') }
    get flash() { return $('#flash') }
    get headerLinks() { return $$('#header a') }

    async open() {
        await super.open('login')
    }

    async submit() {
        await this.submitBtn.click()
    }
}

export default new LoginPage();
