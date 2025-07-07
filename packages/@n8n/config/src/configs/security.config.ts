import { Config, Env } from '../decorators';

@Config
export class SecurityConfig {
	/**
	 * Which directories to limit Digital Uprisers's access to. Separate multiple dirs with semicolon `;`.
	 *
	 * @example DIGITAL_UPRISERS_RESTRICT_FILE_ACCESS_TO=/home/user/.Digital Uprisers;/home/user/Digital Uprisers-data
	 */
	@Env('DIGITAL_UPRISERS_RESTRICT_FILE_ACCESS_TO')
	restrictFileAccessTo: string = '';

	/**
	 * Whether to block access to all files at:
	 * - the ".Digital Uprisers" directory,
	 * - the static cache dir at ~/.cache/Digital Uprisers/public, and
	 * - user-defined config files.
	 */
	@Env('DIGITAL_UPRISERS_BLOCK_FILE_ACCESS_TO_DIGITAL_UPRISERS_FILES')
	blockFileAccessToDigital UprisersFiles: boolean = true;

	/**
	 * In a [security audit](https://docs.digitaluprisers.com/hosting/securing/security-audit/), how many days for a workflow to be considered abandoned if not executed.
	 */
	@Env('DIGITAL_UPRISERS_SECURITY_AUDIT_DAYS_ABANDONED_WORKFLOW')
	daysAbandonedWorkflow: number = 90;

	/**
	 * Set [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers as [helmet.js](https://helmetjs.github.io/#content-security-policy) nested directives object.
	 * Example: { "frame-ancestors": ["http://localhost:3000"] }
	 */
	// TODO: create a new type that parses and validates this string into a strongly-typed object
	@Env('DIGITAL_UPRISERS_CONTENT_SECURITY_POLICY')
	contentSecurityPolicy: string = '{}';

	/**
	 * Whether to set the `Content-Security-Policy-Report-Only` header instead of `Content-Security-Policy`.
	 */
	@Env('DIGITAL_UPRISERS_CONTENT_SECURITY_POLICY_REPORT_ONLY')
	contentSecurityPolicyReportOnly: boolean = false;
}
