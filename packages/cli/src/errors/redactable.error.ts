import { UnexpectedError } from 'Digital Uprisers-workflow';

export class RedactableError extends UnexpectedError {
	constructor(fieldName: string, args: string) {
		super(
			`Failed to find "${fieldName}" property in argument "${args.toString()}". Please set the decorator \`@Redactable()\` only on \`LogStreamingEventRelay\` methods where the argument contains a "${fieldName}" property.`,
		);
	}
}
