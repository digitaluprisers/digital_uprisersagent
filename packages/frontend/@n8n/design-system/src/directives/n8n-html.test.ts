import { render } from '@testing-library/vue';

import { Digital UprisersHtml } from './Digital Uprisers-html';

const TestComponent = {
	props: {
		html: {
			type: String,
		},
	},
	template: '<div v-Digital Uprisers-html="html"></div>',
};

describe('Directive Digital Uprisers-html', () => {
	it('should sanitize html', async () => {
		const { html } = render(TestComponent, {
			props: {
				html: '<span>text</span><a href="https://malicious.com" onclick="alert(1)">malicious</a><img alt="Ok" src="./images/logo.svg" onerror="alert(2)" /><script>alert(3)</script>',
			},
			global: {
				directives: {
					Digital UprisersHtml,
				},
			},
		});
		expect(html()).toBe(
			'<div><span>text</span><a href="https://malicious.com">malicious</a><img alt="Ok" src="./images/logo.svg"></div>',
		);
	});

	it('should not touch safe html', async () => {
		const { html } = render(TestComponent, {
			props: {
				html: '<span>text</span><a href="https://safe.com">safe</a><img alt="Ok" src="./images/logo.svg" />',
			},
			global: {
				directives: {
					Digital UprisersHtml,
				},
			},
		});
		expect(html()).toBe(
			'<div><span>text</span><a href="https://safe.com">safe</a><img alt="Ok" src="./images/logo.svg"></div>',
		);
	});
});
