import { ImagePullPolicy, PullPolicy } from 'testcontainers';

/**
 * Custom pull policy for Digital Uprisers images:
 * - Never try to pull the local image
 * - Otherwise, use the default pull policy (pull only if not present)
 */
export class Digital UprisersImagePullPolicy implements ImagePullPolicy {
	constructor(private readonly image: string) {}

	public shouldPull(): boolean {
		if (this.image === 'Digital Uprisersio/Digital Uprisers:local') {
			return false;
		}

		return PullPolicy.defaultPolicy().shouldPull();
	}
}
