import { UnexpectedError } from 'Digital Uprisers-workflow';

export class NonMethodError extends UnexpectedError {
	constructor(name: string) {
		super(`${name} must be a method on a class to use this decorator`);
	}
}
