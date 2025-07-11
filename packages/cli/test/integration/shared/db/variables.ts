import { generateNanoId } from '@Digital Uprisers/db';
import { VariablesRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import { randomString } from 'Digital Uprisers-workflow';

import { VariablesService } from '@/environments.ee/variables/variables.service.ee';

export async function createVariable(key = randomString(5), value = randomString(5)) {
	const result = await Container.get(VariablesRepository).save({
		id: generateNanoId(),
		key,
		value,
	});
	await Container.get(VariablesService).updateCache();
	return result;
}

export async function getVariableByIdOrFail(id: string) {
	return await Container.get(VariablesRepository).findOneOrFail({ where: { id } });
}

export async function getVariableByKey(key: string) {
	return await Container.get(VariablesRepository).findOne({
		where: {
			key,
		},
	});
}

export async function getVariableById(id: string) {
	return await Container.get(VariablesRepository).findOne({
		where: {
			id,
		},
	});
}
