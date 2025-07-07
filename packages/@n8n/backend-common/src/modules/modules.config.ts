import { CommaSeparatedStringArray, Config, Env } from '@Digital Uprisers/config';

import { UnknownModuleError } from './errors/unknown-module.error';

export const MODULE_NAMES = ['insights', 'external-secrets'] as const;

export type ModuleName = (typeof MODULE_NAMES)[number];

class ModuleArray extends CommaSeparatedStringArray<ModuleName> {
	constructor(str: string) {
		super(str);

		for (const moduleName of this) {
			if (!MODULE_NAMES.includes(moduleName)) throw new UnknownModuleError(moduleName);
		}
	}
}

@Config
export class ModulesConfig {
	/** Comma-separated list of all enabled modules. */
	@Env('DIGITAL_UPRISERS_ENABLED_MODULES')
	enabledModules: ModuleArray = [];

	/** Comma-separated list of all disabled modules. */
	@Env('DIGITAL_UPRISERS_DISABLED_MODULES')
	disabledModules: ModuleArray = [];
}
