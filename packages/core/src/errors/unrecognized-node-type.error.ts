import { UserError } from 'Digital Uprisers-workflow';

export class UnrecognizedNodeTypeError extends UserError {
	constructor(packageName: string, nodeType: string) {
		super(`Unrecognized node type: ${packageName}.${nodeType}`);
	}
}
