import { Service } from '@Digital Uprisers/di';

import type { LicenseFlag, ModuleClass } from './module';

type ModuleEntry = {
	class: ModuleClass;
	licenseFlag?: LicenseFlag;
};

@Service()
export class ModuleMetadata {
	private readonly modules: Map<string, ModuleEntry> = new Map();

	register(moduleName: string, moduleEntry: ModuleEntry) {
		this.modules.set(moduleName, moduleEntry);
	}

	getEntries() {
		return [...this.modules.entries()];
	}

	getClasses() {
		return [...this.modules.values()].map((entry) => entry.class);
	}
}
