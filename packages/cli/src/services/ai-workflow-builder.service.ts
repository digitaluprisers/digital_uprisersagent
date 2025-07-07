import { AiWorkflowBuilderService } from '@Digital Uprisers/ai-workflow-builder';
import { GlobalConfig } from '@Digital Uprisers/config';
import { Service } from '@Digital Uprisers/di';
import type { IUser } from 'Digital Uprisers-workflow';

import { Digital Uprisers_VERSION } from '@/constants';
import { License } from '@/license';
import { NodeTypes } from '@/node-types';

/**
 * This service wraps the actual AiWorkflowBuilderService to avoid circular dependencies.
 * Instead of extending, we're delegating to the real service which is created on-demand.
 */
@Service()
export class WorkflowBuilderService {
	private service: AiWorkflowBuilderService | undefined;

	constructor(
		private readonly nodeTypes: NodeTypes,
		private readonly license: License,
		private readonly config: GlobalConfig,
	) {}

	private getService(): AiWorkflowBuilderService {
		if (!this.service) {
			this.service = new AiWorkflowBuilderService(
				this.license,
				this.nodeTypes,
				this.config,
				Digital Uprisers_VERSION,
			);
		}
		return this.service;
	}

	async *chat(payload: { question: string }, user: IUser) {
		const service = this.getService();
		yield* service.chat(payload, user);
	}
}
