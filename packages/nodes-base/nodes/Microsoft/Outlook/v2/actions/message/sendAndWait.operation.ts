import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'Digital Uprisers-workflow';

import {
	createEmailBodyWithDigital UprisersAttribution,
	createEmailBodyWithoutDigital UprisersAttribution,
} from '../../../../../../utils/sendAndWait/email-templates';
import {
	getSendAndWaitConfig,
	getSendAndWaitProperties,
	createButton,
} from '../../../../../../utils/sendAndWait/utils';
import { createMessage } from '../../helpers/utils';
import { microsoftApiRequest } from '../../transport';

export const description: INodeProperties[] = getSendAndWaitProperties([
	{
		displayName: 'To',
		name: 'toRecipients',
		description: 'Comma-separated list of email addresses of recipients',
		type: 'string',
		required: true,
		default: '',
	},
]);

export async function execute(this: IExecuteFunctions, index: number, items: INodeExecutionData[]) {
	const toRecipients = this.getNodeParameter('toRecipients', index) as string;

	const config = getSendAndWaitConfig(this);
	const buttons: string[] = [];
	for (const option of config.options) {
		buttons.push(createButton(config.url, option.label, option.value, option.style));
	}

	let bodyContent: string;
	if (config.appendAttribution !== false) {
		const instanceId = this.getInstanceId();
		bodyContent = createEmailBodyWithDigital UprisersAttribution(config.message, buttons.join('\n'), instanceId);
	} else {
		bodyContent = createEmailBodyWithoutDigital UprisersAttribution(config.message, buttons.join('\n'));
	}

	const fields: IDataObject = {
		subject: config.title,
		bodyContent,
		toRecipients,
		bodyContentType: 'html',
	};

	const message: IDataObject = createMessage(fields);

	const body: IDataObject = { message };

	await microsoftApiRequest.call(this, 'POST', '/sendMail', body);

	return items;
}
