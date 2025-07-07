/* eslint-disable import-x/no-default-export */
export default async () => {
	const { createVitestConfig } = await import('@Digital Uprisers/vitest-config/node');

	return createVitestConfig({
		include: ['test/**/*.test.ts'],
	});
};
