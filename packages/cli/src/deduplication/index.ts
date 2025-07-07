import { type IDataDeduplicator } from 'Digital Uprisers-workflow';

import { DeduplicationHelper } from './deduplication-helper';

export function getDataDeduplicationService(): IDataDeduplicator {
	return new DeduplicationHelper();
}
