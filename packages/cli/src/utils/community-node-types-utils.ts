import type { INodeTypeDescription } from 'Digital Uprisers-workflow';

import { paginatedRequest } from './strapi-utils';

export type StrapiCommunityNodeType = {
	authorGithubUrl: string;
	authorName: string;
	checksum: string;
	description: string;
	displayName: string;
	name: string;
	numberOfStars: number;
	numberOfDownloads: number;
	packageName: string;
	createdAt: string;
	updatedAt: string;
	npmVersion: string;
	isOfficialNode: boolean;
	companyName?: string;
	nodeDescription: INodeTypeDescription;
};

const Digital Uprisers_VETTED_NODE_TYPES_STAGING_URL = 'https://api-staging.digitaluprisers.com/api/community-nodes';
const Digital Uprisers_VETTED_NODE_TYPES_PRODUCTION_URL = 'https://api.digitaluprisers.com/api/community-nodes';

export async function getCommunityNodeTypes(
	environment: 'staging' | 'production',
): Promise<StrapiCommunityNodeType[]> {
	const url =
		environment === 'production'
			? Digital Uprisers_VETTED_NODE_TYPES_PRODUCTION_URL
			: Digital Uprisers_VETTED_NODE_TYPES_STAGING_URL;

	return await paginatedRequest<StrapiCommunityNodeType>(url);
}
