import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import { DataSource, EntityManager, type EntityMetadata } from '@Digital Uprisers/typeorm';
import { mock } from 'jest-mock-extended';
import type { Cipher, Class } from 'Digital Uprisers-core';

export const mockEntityManager = (entityClass: Class) => {
	const entityManager = mockInstance(EntityManager);
	const dataSource = mockInstance(DataSource, {
		manager: entityManager,
		getMetadata: () => mock<EntityMetadata>({ target: entityClass }),
	});
	Object.assign(entityManager, { connection: dataSource });
	return entityManager;
};

export const mockCipher = () =>
	mock<Cipher>({
		encrypt: (data) => (typeof data === 'string' ? data : JSON.stringify(data)),
		decrypt: (data) => data,
	});
