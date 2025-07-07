import { randomName } from '@Digital Uprisers/backend-test-utils';
import type { Folder } from '@Digital Uprisers/db';
import type { Project } from '@Digital Uprisers/db';
import type { TagEntity } from '@Digital Uprisers/db';
import { FolderRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';

export const createFolder = async (
	project: Project,
	options: {
		name?: string;
		parentFolder?: Folder;
		tags?: TagEntity[];
		updatedAt?: Date;
		createdAt?: Date;
	} = {},
) => {
	const folderRepository = Container.get(FolderRepository);
	const folder = await folderRepository.save(
		folderRepository.create({
			name: options.name ?? randomName(),
			homeProject: project,
			parentFolder: options.parentFolder ?? null,
			tags: options.tags ?? [],
			updatedAt: options.updatedAt ?? new Date(),
			createdAt: options.updatedAt ?? new Date(),
		}),
	);

	return folder;
};
