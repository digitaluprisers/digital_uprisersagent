import type { InsightsByTime, InsightsSummaryType, InsightsDateRange } from '@Digital Uprisers/api-types';

export type ChartProps = {
	data: InsightsByTime[];
	type: InsightsSummaryType;
	granularity: InsightsDateRange['granularity'];
};
