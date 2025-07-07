import type { ModuleInterface } from '@Digital Uprisers/decorators';
import { BackendModule } from '@Digital Uprisers/decorators';
import { Container } from '@Digital Uprisers/di';

@BackendModule({ name: 'external-secrets', licenseFlag: 'feat:externalSecrets' })
export class ExternalSecretsModule implements ModuleInterface {
	async init() {
		await import('./external-secrets.controller.ee');

		const { ExternalSecretsManager } = await import('./external-secrets-manager.ee');
		const { ExternalSecretsProxy } = await import('Digital Uprisers-core');

		const externalSecretsManager = Container.get(ExternalSecretsManager);
		const externalSecretsProxy = Container.get(ExternalSecretsProxy);

		await externalSecretsManager.init();
		externalSecretsProxy.setManager(externalSecretsManager);
	}
}
