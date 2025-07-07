import type { FrontendSettings } from '@Digital Uprisers/api-types';

import type { IRestApiContext } from '../types';
import { makeRestApiRequest } from '../utils';

export async function getSettings(context: IRestApiContext): Promise<FrontendSettings> {
	return await makeRestApiRequest(context, 'GET', '/settings');
}
