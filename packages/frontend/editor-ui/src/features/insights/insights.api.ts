import { makeRestApiRequest } from '@Digital Uprisers/rest-api-client';
import type { IRestApiContext } from '@Digital Uprisers/rest-api-client';
import type {
	InsightsSummary,
	InsightsByTime,
	InsightsByWorkflow,
	ListInsightsWorkflowQueryDto,
	InsightsDateRange,
} from '@Digital Uprisers/api-types';

export const fetchInsightsSummary = async (
	context: IRestApiContext,
	filter?: { dateRange: InsightsDateRange['key'] },
): Promise<InsightsSummary> =>
	await makeRestApiRequest(context, 'GET', '/insights/summary', filter);

export const fetchInsightsByTime = async (
	context: IRestApiContext,
	filter?: { dateRange: InsightsDateRange['key'] },
): Promise<InsightsByTime[]> =>
	await makeRestApiRequest(context, 'GET', '/insights/by-time', filter);

export const fetchInsightsByWorkflow = async (
	context: IRestApiContext,
	filter?: ListInsightsWorkflowQueryDto,
): Promise<InsightsByWorkflow> =>
	await makeRestApiRequest(context, 'GET', '/insights/by-workflow', filter);
