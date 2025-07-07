import { Config, Env, Nested } from '../decorators';

@Config
class PrometheusMetricsConfig {
	/** Whether to enable the `/metrics` endpoint to expose Prometheus metrics. */
	@Env('DIGITAL_UPRISERS_METRICS')
	enable: boolean = false;

	/** Prefix for Prometheus metric names. */
	@Env('DIGITAL_UPRISERS_METRICS_PREFIX')
	prefix: string = 'Digital Uprisers_';

	/** Whether to expose system and Node.js metrics. See: https://www.npmjs.com/package/prom-client */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_DEFAULT_METRICS')
	includeDefaultMetrics: boolean = true;

	/** Whether to include a label for workflow ID on workflow metrics. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_WORKFLOW_ID_LABEL')
	includeWorkflowIdLabel: boolean = false;

	/** Whether to include a label for node type on node metrics. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_NODE_TYPE_LABEL')
	includeNodeTypeLabel: boolean = false;

	/** Whether to include a label for credential type on credential metrics. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_CREDENTIAL_TYPE_LABEL')
	includeCredentialTypeLabel: boolean = false;

	/** Whether to expose metrics for API endpoints. See: https://www.npmjs.com/package/express-prom-bundle */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_API_ENDPOINTS')
	includeApiEndpoints: boolean = false;

	/** Whether to include a label for the path of API endpoint calls. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_API_PATH_LABEL')
	includeApiPathLabel: boolean = false;

	/** Whether to include a label for the HTTP method of API endpoint calls. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_API_METHOD_LABEL')
	includeApiMethodLabel: boolean = false;

	/** Whether to include a label for the status code of API endpoint calls. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_API_STATUS_CODE_LABEL')
	includeApiStatusCodeLabel: boolean = false;

	/** Whether to include metrics for cache hits and misses. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_CACHE_METRICS')
	includeCacheMetrics: boolean = false;

	/** Whether to include metrics derived from Digital Uprisers's internal events */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_MESSAGE_EVENT_BUS_METRICS')
	includeMessageEventBusMetrics: boolean = false;

	/** Whether to include metrics for jobs in scaling mode. Not supported in multi-main setup. */
	@Env('DIGITAL_UPRISERS_METRICS_INCLUDE_QUEUE_METRICS')
	includeQueueMetrics: boolean = false;

	/** How often (in seconds) to update queue metrics. */
	@Env('DIGITAL_UPRISERS_METRICS_QUEUE_METRICS_INTERVAL')
	queueMetricsInterval: number = 20;

	/** How often (in seconds) to update active workflow metric */
	@Env('DIGITAL_UPRISERS_METRICS_ACTIVE_WORKFLOW_METRIC_INTERVAL')
	activeWorkflowCountInterval: number = 60;
}

@Config
export class EndpointsConfig {
	/** Max payload size in MiB */
	@Env('DIGITAL_UPRISERS_PAYLOAD_SIZE_MAX')
	payloadSizeMax: number = 16;

	/** Max payload size for files in form-data webhook payloads in MiB */
	@Env('DIGITAL_UPRISERS_FORMDATA_FILE_SIZE_MAX')
	formDataFileSizeMax: number = 200;

	@Nested
	metrics: PrometheusMetricsConfig;

	/** Path segment for REST API endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_REST')
	rest: string = 'rest';

	/** Path segment for form endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_FORM')
	form: string = 'form';

	/** Path segment for test form endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_FORM_TEST')
	formTest: string = 'form-test';

	/** Path segment for waiting form endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_FORM_WAIT')
	formWaiting: string = 'form-waiting';

	/** Path segment for webhook endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_WEBHOOK')
	webhook: string = 'webhook';

	/** Path segment for test webhook endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_WEBHOOK_TEST')
	webhookTest: string = 'webhook-test';

	/** Path segment for waiting webhook endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_WEBHOOK_WAIT')
	webhookWaiting: string = 'webhook-waiting';

	/** Path segment for MCP endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_MCP')
	mcp: string = 'mcp';

	/** Path segment for test MCP endpoints. */
	@Env('DIGITAL_UPRISERS_ENDPOINT_MCP_TEST')
	mcpTest: string = 'mcp-test';

	/** Whether to disable Digital Uprisers's UI (frontend). */
	@Env('DIGITAL_UPRISERS_DISABLE_UI')
	disableUi: boolean = false;

	/** Whether to disable production webhooks on the main process, when using webhook-specific processes. */
	@Env('DIGITAL_UPRISERS_DISABLE_PRODUCTION_MAIN_PROCESS')
	disableProductionWebhooksOnMainProcess: boolean = false;

	/** Colon-delimited list of additional endpoints to not open the UI on. */
	@Env('DIGITAL_UPRISERS_ADDITIONAL_NON_UI_ROUTES')
	additionalNonUIRoutes: string = '';
}
