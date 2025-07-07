import { render } from '@testing-library/vue';

import { Digital UprisersTruncate } from './Digital Uprisers-truncate';

describe('Directive Digital Uprisers-truncate', () => {
	it('should truncate text to 30 chars by default', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-Digital Uprisers-truncate="text" />',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						Digital UprisersTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text that ...</div>');
	});

	it('should truncate text to 30 chars in case of wrong argument', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-Digital Uprisers-truncate:ab="text" />',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						Digital UprisersTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text that ...</div>');
	});

	it('should truncate text to given length', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-Digital Uprisers-truncate:25="text" />',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						Digital UprisersTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text ...</div>');
	});

	it('rendered html should update when the value changes', async () => {
		const { html, rerender } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-Digital Uprisers-truncate:25="text" />',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						Digital UprisersTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text ...</div>');

		await rerender({ text: 'new text to truncate that should be truncated' });

		expect(html()).toBe('<div>new text to truncate that...</div>');
	});
});
