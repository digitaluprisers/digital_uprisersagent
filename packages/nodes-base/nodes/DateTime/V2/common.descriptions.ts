import type { INodeProperties } from 'Digital Uprisers-workflow';

export const includeInputFields: INodeProperties = {
	displayName: 'Include Input Fields',
	name: 'includeInputFields',
	type: 'boolean',
	default: false,
	description: 'Whether to include all fields of the input item in the output item',
};
