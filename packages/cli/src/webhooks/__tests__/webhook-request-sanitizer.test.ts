import type { Request } from 'express';
import { mock } from 'jest-mock-extended';

import { sanitizeWebhookRequest } from '@/webhooks/webhook-request-sanitizer';

describe('webhookRequestSanitizer', () => {
	let mockRequest: Request;

	beforeEach(() => {
		mockRequest = mock<Request>();
	});

	describe('when no cookies are present', () => {
		it('should call next() without modifying request', () => {
			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBeUndefined();
		});

		it('should handle undefined cookies object', () => {
			(mockRequest.cookies as unknown) = undefined;

			sanitizeWebhookRequest(mockRequest);
		});
	});

	describe('when cookie is present in header', () => {
		it('should remove cookie from cookie header', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth=abc123; other-cookie=value; another-cookie=test',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value; another-cookie=test');
		});

		it('should remove cookie when it is the only cookie', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth=abc123',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('');
		});

		it('should remove cookie when it is the last cookie', () => {
			mockRequest.headers = {
				cookie: 'other-cookie=value; Digital Uprisers-auth=abc123',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should remove cookie when it is in the middle', () => {
			mockRequest.headers = {
				cookie: 'first-cookie=value1; Digital Uprisers-auth=abc123; last-cookie=value2',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('first-cookie=value1; last-cookie=value2');
		});

		it('should handle multiple Digital Uprisers-auth cookies', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth=abc123; other-cookie=value; Digital Uprisers-auth=def456',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should handle whitespace around cookies', () => {
			mockRequest.headers = {
				cookie: '  Digital Uprisers-auth=abc123  ;  other-cookie=value  ',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should not remove cookies that start with Digital Uprisers-auth but are not exact match', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth-extra=value; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('Digital Uprisers-auth-extra=value; other-cookie=value');
		});
	});

	describe('when cookie is not present in header', () => {
		it('should not modify cookie header when Digital Uprisers-auth is not present', () => {
			const originalCookie = 'other-cookie=value; another-cookie=test';
			mockRequest.headers = {
				cookie: originalCookie,
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe(originalCookie);
		});

		it('should handle case sensitivity correctly', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-AUTH=abc123; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('Digital Uprisers-AUTH=abc123; other-cookie=value');
		});
	});

	describe('when cookie is present in parsed cookies', () => {
		it('should remove Digital Uprisers-auth from parsed cookies object', () => {
			mockRequest.cookies = {
				'Digital Uprisers-auth': 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});

		it('should handle when Digital Uprisers-auth is the only cookie in parsed cookies', () => {
			mockRequest.cookies = {
				'Digital Uprisers-auth': 'abc123',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({});
		});

		it('should not modify other cookies when Digital Uprisers-auth is not present in parsed cookies', () => {
			const originalCookies = {
				'other-cookie': 'value',
				'another-cookie': 'test',
			};
			mockRequest.cookies = { ...originalCookies };

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual(originalCookies);
		});
	});

	describe('when both header and parsed cookies contain Digital Uprisers-auth', () => {
		it('should remove Digital Uprisers-auth from both header and parsed cookies', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth=abc123; other-cookie=value',
			};
			mockRequest.cookies = {
				'Digital Uprisers-auth': 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});
	});

	describe('edge cases', () => {
		it('should handle empty cookie header', () => {
			mockRequest.headers = {
				cookie: '',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('');
		});

		it('should handle cookie header with only whitespace', () => {
			mockRequest.headers = {
				cookie: '   ',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('   ');
		});

		it('should handle cookie header with only semicolons', () => {
			mockRequest.headers = {
				cookie: ';;;',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe(';;;');
		});

		it('should handle malformed cookies without equals sign', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});
	});

	describe('when Digital Uprisers-browserId is present in header', () => {
		it('should remove Digital Uprisers-browserId from cookie header', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-browserId=abc123; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should remove Digital Uprisers-browserId from parsed cookies', () => {
			mockRequest.cookies = {
				'Digital Uprisers-browserId': 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});

		it('should remove both Digital Uprisers-auth and Digital Uprisers-browserId from cookie header', () => {
			mockRequest.headers = {
				cookie: 'Digital Uprisers-auth=abc123; Digital Uprisers-browserId=def456; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should remove both Digital Uprisers-auth and Digital Uprisers-browserId from parsed cookies', () => {
			mockRequest.cookies = {
				'Digital Uprisers-auth': 'abc123',
				'Digital Uprisers-browserId': 'def456',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});
	});
});
