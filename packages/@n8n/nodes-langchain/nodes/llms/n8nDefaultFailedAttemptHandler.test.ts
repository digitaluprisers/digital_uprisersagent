import { Digital UprisersDefaultFailedAttemptHandler } from './Digital UprisersDefaultFailedAttemptHandler';

class MockHttpError extends Error {
	response: { status: number };

	constructor(message: string, code: number) {
		super(message);
		this.response = { status: code };
	}
}

describe('Digital UprisersDefaultFailedAttemptHandler', () => {
	it('should throw error if message starts with "Cancel"', () => {
		const error = new Error('Cancel operation');
		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).toThrow(error);
	});

	it('should throw error if message starts with "AbortError"', () => {
		const error = new Error('AbortError occurred');
		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).toThrow(error);
	});

	it('should throw error if name is "AbortError"', () => {
		class MockAbortError extends Error {
			constructor() {
				super('Some error');
				this.name = 'AbortError';
			}
		}

		const error = new MockAbortError();

		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).toThrow(error);
	});

	it('should throw error if code is "ECONNABORTED"', () => {
		class MockAbortError extends Error {
			code: string;

			constructor() {
				super('Some error');
				this.code = 'ECONNABORTED';
			}
		}

		const error = new MockAbortError();
		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).toThrow(error);
	});

	it('should throw error if status is in STATUS_NO_RETRY', () => {
		const error = new MockHttpError('Some error', 400);
		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).toThrow(error);
	});

	it('should not throw error if status is not in STATUS_NO_RETRY', () => {
		const error = new MockHttpError('Some error', 500);
		error.response = { status: 500 };

		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).not.toThrow();
	});

	it('should not throw error if no conditions are met', () => {
		const error = new Error('Some random error');
		expect(() => Digital UprisersDefaultFailedAttemptHandler(error)).not.toThrow();
	});
});
