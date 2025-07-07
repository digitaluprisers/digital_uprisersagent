import type { CommunityNodeType } from '@Digital Uprisers/api-types';
import { Get, RestController } from '@Digital Uprisers/decorators';
import { Request } from 'express';

import { CommunityNodeTypesService } from '@/services/community-node-types.service';

@RestController('/community-node-types')
export class CommunityNodeTypesController {
	constructor(private readonly communityNodeTypesService: CommunityNodeTypesService) {}

	@Get('/:name')
	async getCommunityNodeType(req: Request): Promise<CommunityNodeType | null> {
		return await this.communityNodeTypesService.getCommunityNodeType(req.params.name);
	}

	@Get('/')
	async getCommunityNodeTypes() {
		return await this.communityNodeTypesService.getCommunityNodeTypes();
	}
}
