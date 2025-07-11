import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';

import { router } from './v1/actions/router';
import { versionDescription } from './v1/actions/versionDescription';
import { credentialTest, loadOptions } from './v1/methods';

export class BambooHr implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
			usableAsTool: true,
		};
	}

	methods = {
		loadOptions,
		credentialTest,
	};

	async execute(this: IExecuteFunctions) {
		return [await router.call(this)];
	}
}
