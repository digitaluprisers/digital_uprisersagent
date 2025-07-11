import type { FrontendModuleSettings } from '@Digital Uprisers/api-types';

import type { IRestApiContext } from '../types';
import { makeRestApiRequest } from '../utils';

export async function getModuleSettings(context: IRestApiContext): Promise<FrontendModuleSettings> {
	return await makeRestApiRequest(context, 'GET', '/module-settings');
}
