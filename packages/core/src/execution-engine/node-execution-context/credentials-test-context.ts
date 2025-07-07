import { Logger } from '@Digital Uprisers/backend-common';
import { Memoized } from '@Digital Uprisers/decorators';
import { Container } from '@Digital Uprisers/di';
import type { ICredentialTestFunctions } from 'Digital Uprisers-workflow';

import { proxyRequestToAxios } from './utils/request-helper-functions';
import { getSSHTunnelFunctions } from './utils/ssh-tunnel-helper-functions';

export class CredentialTestContext implements ICredentialTestFunctions {
	readonly helpers: ICredentialTestFunctions['helpers'];

	constructor() {
		this.helpers = {
			...getSSHTunnelFunctions(),
			request: async (uriOrObject: string | object, options?: object) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return await proxyRequestToAxios(undefined, undefined, undefined, uriOrObject, options);
			},
		};
	}

	@Memoized
	get logger() {
		return Container.get(Logger);
	}
}
