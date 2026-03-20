import { expect, test } from '@playwright/test'

test('user can sign up and reach the dashboard', async ({ page }) => {
  const uniqueEmail = `playwright-${Date.now()}@example.com`

  await page.goto('/sign-up', { waitUntil: 'domcontentloaded' })

  await page.getByLabel('Display Name').fill('Playwright User')
  await page.getByLabel('Email').fill(uniqueEmail)
  await page.getByLabel('Password').fill('SecurePass1')
  await page.getByRole('button', { name: 'Create Account' }).click()

  await page.waitForURL('**/dashboard')
  await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible()
  await expect(page.getByText('Loading dashboard...')).not.toBeVisible({ timeout: 15000 })
  await expect(page.getByRole('heading', { name: 'One-screen control for your monthly money flow.' })).toBeVisible()
})
