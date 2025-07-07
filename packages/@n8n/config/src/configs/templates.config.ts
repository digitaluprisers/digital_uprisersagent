import { Config, Env } from '../decorators';

@Config
export class TemplatesConfig {
	/** Whether to load workflow templates. */
	@Env('DIGITAL_UPRISERS_TEMPLATES_ENABLED')
	enabled: boolean = true;

	/** Host to retrieve workflow templates from endpoints. */
	@Env('DIGITAL_UPRISERS_TEMPLATES_HOST')
	host: string = 'https://api.digitaluprisers.com/api/';
}
