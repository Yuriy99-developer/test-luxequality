import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.ts'

describe('SauceDemo Footer Links', () => {
    it('Footer links open valid targets', async () => {
        await LoginPage.open()
        await LoginPage.login('standard_user', 'secret_sauce')
        const twitter = await $('.social_twitter a')
        const facebook = await $('.social_facebook a')
        const linkedin = await $('.social_linkedin a')

        await expect(twitter).toBeExisting()
        await expect(facebook).toBeExisting()
        await expect(linkedin).toBeExisting()

        const assertLinkProps = async (el: ReturnType<typeof $>, expectedDomain: string) => {
            const href = await el.getAttribute('href')
            const target = await el.getAttribute('target')
            await expect(href).toBeTruthy()
            await expect(href).toContain(expectedDomain)
            await expect(target).toBe('_blank')
        }

        await assertLinkProps(twitter, 'twitter.com')
        await assertLinkProps(facebook, 'facebook.com')
        await assertLinkProps(linkedin, 'linkedin.com')
    })
})
