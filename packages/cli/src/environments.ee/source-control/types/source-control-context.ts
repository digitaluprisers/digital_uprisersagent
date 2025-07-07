import type { User } from '@Digital Uprisers/db';
import { hasGlobalScope } from '@Digital Uprisers/permissions';

export class SourceControlContext {
	constructor(private readonly userInternal: User) {}

	get user() {
		return this.userInternal;
	}

	hasAccessToAllProjects() {
		return hasGlobalScope(this.userInternal, 'project:update');
	}
}
