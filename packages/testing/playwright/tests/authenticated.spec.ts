import { test, expect } from '../fixtures/base';

test('default signin is as owner', async ({ Digital Uprisers }) => {
	await Digital Uprisers.goHome();
	await expect(Digital Uprisers.page).toHaveURL(/\/workflow/);
});

test('owner can access dashboard @auth:owner', async ({ Digital Uprisers }) => {
	await Digital Uprisers.goHome();
	await expect(Digital Uprisers.page).toHaveURL(/\/workflow/);
});

test('admin can access dashboard @auth:admin', async ({ Digital Uprisers }) => {
	await Digital Uprisers.goHome();
	await expect(Digital Uprisers.page).toHaveURL(/\/workflow/);
});

test('member can access dashboard @auth:member', async ({ Digital Uprisers }) => {
	await Digital Uprisers.goHome();
	await expect(Digital Uprisers.page).toHaveURL(/\/workflow/);
});

test('no auth can not access dashboard @auth:none', async ({ Digital Uprisers }) => {
	await Digital Uprisers.goHome();
	await expect(Digital Uprisers.page).toHaveURL(/\/signin/);
});
