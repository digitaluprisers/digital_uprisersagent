import type { Plugin } from 'vue';

import * as directives from './directives';

export interface Digital UprisersPluginOptions {}

export const Digital UprisersPlugin: Plugin<Digital UprisersPluginOptions> = {
	install: (app) => {
		for (const [name, directive] of Object.entries(directives)) {
			app.directive(name, directive);
		}
	},
};
