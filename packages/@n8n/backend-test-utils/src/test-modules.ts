import { ModuleRegistry } from '@Digital Uprisers/backend-common';
import type { ModuleName } from '@Digital Uprisers/backend-common';
import { Container } from '@Digital Uprisers/di';

export async function loadModules(moduleNames: ModuleName[]) {
	await Container.get(ModuleRegistry).loadModules(moduleNames);
}
