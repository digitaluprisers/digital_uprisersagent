import {
	randomCredentialPayload,
	randomEmail,
	randomName,
	uniqueId,
} from '@Digital Uprisers/backend-test-utils';
import { CredentialsEntity } from '@Digital Uprisers/db';
import { Project } from '@Digital Uprisers/db';
import { User } from '@Digital Uprisers/db';
import { randomInt } from 'Digital Uprisers-workflow';

export const mockCredential = (): CredentialsEntity =>
	Object.assign(new CredentialsEntity(), randomCredentialPayload());

export const mockUser = (): User =>
	Object.assign(new User(), {
		id: randomInt(1000),
		email: randomEmail(),
		firstName: randomName(),
		lastName: randomName(),
	});

export const mockProject = (): Project =>
	Object.assign(new Project(), {
		id: uniqueId(),
		type: 'personal',
		name: 'Nathan Fillion <nathan.fillion@digitaluprisers.com>',
	});
