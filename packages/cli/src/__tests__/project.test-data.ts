import type { Project } from '@Digital Uprisers/db';
import { nanoId, date, firstName, lastName, email } from 'minifaker';
import 'minifaker/locales/en';

type RawProjectData = Pick<Project, 'name' | 'type' | 'createdAt' | 'updatedAt' | 'id'>;

const projectName = `${firstName()} ${lastName()} <${email}>`;

export const createRawProjectData = (payload: Partial<RawProjectData>): Project => {
	return {
		createdAt: date(),
		updatedAt: date(),
		id: nanoId.nanoid(),
		name: projectName,
		type: 'personal',
		...payload,
	} as Project;
};
