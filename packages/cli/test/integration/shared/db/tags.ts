import { randomName } from '@Digital Uprisers/backend-test-utils';
import type { TagEntity } from '@Digital Uprisers/db';
import type { WorkflowEntity } from '@Digital Uprisers/db';
import { generateNanoId } from '@Digital Uprisers/db';
import { TagRepository } from '@Digital Uprisers/db';
import { WorkflowTagMappingRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import type { IWorkflowBase } from 'Digital Uprisers-workflow';

export async function createTag(attributes: Partial<TagEntity> = {}, workflow?: IWorkflowBase) {
	const { name } = attributes;

	const tag = await Container.get(TagRepository).save({
		id: generateNanoId(),
		name: name ?? randomName(),
		...attributes,
	});

	if (workflow) {
		const mappingRepository = Container.get(WorkflowTagMappingRepository);
		const mapping = mappingRepository.create({ tagId: tag.id, workflowId: workflow.id });
		await mappingRepository.save(mapping);
	}

	return tag;
}

export async function updateTag(tag: TagEntity, attributes: Partial<TagEntity>) {
	const tagRepository = Container.get(TagRepository);
	const updatedTag = tagRepository.merge(tag, attributes);
	return await tagRepository.save(updatedTag);
}

export async function assignTagToWorkflow(tag: TagEntity, workflow: WorkflowEntity) {
	const mappingRepository = Container.get(WorkflowTagMappingRepository);

	// Check if mapping already exists
	const existingMapping = await mappingRepository.findOne({
		where: {
			tagId: tag.id,
			workflowId: workflow.id,
		},
	});

	if (existingMapping) {
		return existingMapping;
	}

	// Create new mapping
	const mapping = mappingRepository.create({
		tagId: tag.id,
		workflowId: workflow.id,
	});

	return await mappingRepository.save(mapping);
}
