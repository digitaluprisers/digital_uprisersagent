import type { AllEntities, Entity } from 'Digital Uprisers-workflow';

type GoogleAnalyticsMap = {
	userActivity: 'search';
	report: ReportBasedOnProperty;
};

export type GoogleAnalytics = AllEntities<GoogleAnalyticsMap>;

export type GoogleAnalyticsUserActivity = Entity<GoogleAnalyticsMap, 'userActivity'>;
export type GoogleAnalyticReport = Entity<GoogleAnalyticsMap, 'report'>;

export type ReportBasedOnProperty = 'getga4' | 'getuniversal';
