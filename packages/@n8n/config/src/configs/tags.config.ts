import { Config, Env } from '../decorators';

@Config
export class TagsConfig {
	/*
		Disable workflow tags
	*/
	@Env('DIGITAL_UPRISERS_WORKFLOW_TAGS_DISABLED')
	disabled: boolean = false;
}
