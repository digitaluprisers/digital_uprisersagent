import { render } from '@testing-library/vue';

import { Digital UprisersSmartDecimal } from './Digital Uprisers-smart-decimal';

describe('Directive Digital Uprisers-truncate', () => {
	it('should leave number as is without decimals', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal="text" />',
			},
			{
				props: {
					text: '42',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42</p>');
	});

	it('should leave number as is without decimals with binding arg', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal:3="text" />',
			},
			{
				props: {
					text: '42',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42</p>');
	});

	it('should leave the number with 1 decimal', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal="text" />',
			},
			{
				props: {
					text: '42.1',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42.1</p>');
	});

	it('should format number to 2 decimal places by default', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal="text">',
			},
			{
				props: {
					text: '42.123456',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42.12</p>');
	});

	it('should format number to 1 decimal place', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal:1="text">',
			},
			{
				props: {
					text: '42.123456',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42.1</p>');
	});

	it('should format number to 3 decimal places', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal:3="text" />',
			},
			{
				props: {
					text: '42.123456',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42.123</p>');
	});

	it('should handle negative numbers correctly', () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal="text" />',
			},
			{
				props: {
					text: '-42.123456',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>-42.12</p>');
	});

	it('should handle zero correctly', () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal="text" />',
			},
			{
				props: {
					text: '0',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>0</p>');
	});

	it('should handle very small numbers correctly', () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal:5="text" />',
			},
			{
				props: {
					text: '0.000567',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>0.00057</p>');
	});

	it('should format number to 2 decimal places if that has fewer decimals than the desired', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal:3="text" />',
			},
			{
				props: {
					text: '42.12',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42.12</p>');
	});

	it('rendered html should update when the value changes', async () => {
		const { html, rerender } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<p v-Digital Uprisers-smart-decimal:3="text" />',
			},
			{
				props: {
					text: '42.12',
				},
				global: {
					directives: {
						Digital UprisersSmartDecimal,
					},
				},
			},
		);
		expect(html()).toBe('<p>42.12</p>');

		await rerender({ text: '12.42' });

		expect(html()).toBe('<p>12.42</p>');
	});
});
