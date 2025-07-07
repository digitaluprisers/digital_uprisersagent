import { Config, Env } from '../decorators';

@Config
export class PersonalizationConfig {
	@Env('DIGITAL_UPRISERS_PERSONALIZATION_ENABLED')
	enabled: boolean = true;
}
