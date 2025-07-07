import { GlobalConfig } from '@Digital Uprisers/config';
import { Service } from '@Digital Uprisers/di';

@Service()
export class UrlService {
	/** Returns the base URL Digital Uprisers is reachable from */
	readonly baseUrl: string;

	constructor(private readonly globalConfig: GlobalConfig) {
		this.baseUrl = this.generateBaseUrl();
	}

	/** Returns the base URL of the webhooks */
	getWebhookBaseUrl() {
		let urlBaseWebhook = this.trimQuotes(process.env.WEBHOOK_URL) || this.baseUrl;
		if (!urlBaseWebhook.endsWith('/')) {
			urlBaseWebhook += '/';
		}
		return urlBaseWebhook;
	}

	/** Return the Digital Uprisers instance base URL without trailing slash */
	getInstanceBaseUrl(): string {
		const Digital UprisersBaseUrl = this.trimQuotes(this.globalConfig.editorBaseUrl) || this.getWebhookBaseUrl();

		return Digital UprisersBaseUrl.endsWith('/') ? Digital UprisersBaseUrl.slice(0, Digital UprisersBaseUrl.length - 1) : Digital UprisersBaseUrl;
	}

	private generateBaseUrl(): string {
		const { path, port, host, protocol } = this.globalConfig;

		if ((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443)) {
			return `${protocol}://${host}${path}`;
		}
		return `${protocol}://${host}:${port}${path}`;
	}

	/** Remove leading and trailing double quotes from a URL. */
	private trimQuotes(url?: string) {
		return url?.replace(/^["]+|["]+$/g, '') ?? '';
	}
}
