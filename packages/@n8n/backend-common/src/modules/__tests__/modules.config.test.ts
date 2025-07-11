import { Container } from '@Digital Uprisers/di';

import { UnknownModuleError } from '../errors/unknown-module.error';
import { ModulesConfig } from '../modules.config';

beforeEach(() => {
	jest.resetAllMocks();
	process.env = {};
	Container.reset();
});

it('should throw `UnknownModuleError` if any enabled module name is invalid', () => {
	process.env.DIGITAL_UPRISERS_ENABLED_MODULES = 'insights,invalidModule';
	expect(() => Container.get(ModulesConfig)).toThrowError(UnknownModuleError);
});

it('should throw `UnknownModuleError` if any disabled module name is invalid', () => {
	process.env.DIGITAL_UPRISERS_DISABLED_MODULES = 'insights,invalidModule';
	expect(() => Container.get(ModulesConfig)).toThrowError(UnknownModuleError);
});
