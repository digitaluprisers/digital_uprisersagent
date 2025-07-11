import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const versionDescription: INodeTypeDescription = {
	displayName: 'Send Email',
	name: 'emailSend',
	icon: 'fa:envelope',
	group: ['output'],
	version: 1,
	description: 'Sends an Email',
	defaults: {
		name: 'Send Email',
		color: '#00bb88',
	},
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
	credentials: [
		{
			name: 'smtp',
			required: true,
		},
	],
	properties: [
		// TODO: Add choice for text as text or html  (maybe also from name)
		{
			displayName: 'From Email',
			name: 'fromEmail',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'admin@example.com',
			description: 'Email address of the sender optional with name',
		},
		{
			displayName: 'To Email',
			name: 'toEmail',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'info@example.com',
			description: 'Email address of the recipient',
		},
		{
			displayName: 'CC Email',
			name: 'ccEmail',
			type: 'string',
			default: '',
			placeholder: 'cc@example.com',
			description: 'Email address of CC recipient',
		},
		{
			displayName: 'BCC Email',
			name: 'bccEmail',
			type: 'string',
			default: '',
			placeholder: 'bcc@example.com',
			description: 'Email address of BCC recipient',
		},
		{
			displayName: 'Subject',
			name: 'subject',
			type: 'string',
			default: '',
			placeholder: 'My subject line',
			description: 'Subject line of the email',
		},
		{
			displayName: 'Text',
			name: 'text',
			type: 'string',
			typeOptions: {
				rows: 5,
			},
			default: '',
			description: 'Plain text message of email',
		},
		{
			displayName: 'HTML',
			name: 'html',
			type: 'string',
			typeOptions: {
				rows: 5,
			},
			default: '',
			description: 'HTML text message of email',
		},
		{
			displayName: 'Attachments',
			name: 'attachments',
			type: 'string',
			default: '',
			description:
				'Name of the binary properties that contain data to add to email as attachment. Multiple ones can be comma-separated.',
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add option',
			default: {},
			options: [
				{
					displayName: 'Ignore SSL Issues (Insecure)',
					name: 'allowUnauthorizedCerts',
					type: 'boolean',
					default: false,
					description: 'Whether to connect even if SSL certificate validation is not possible',
				},
				{
					displayName: 'Reply To',
					name: 'replyTo',
					type: 'string',
					default: '',
					placeholder: 'info@example.com',
					description: 'The email address to send the reply to',
				},
			],
		},
	],
};

export class EmailSendV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < length; itemIndex++) {
			try {
				item = items[itemIndex];

				const fromEmail = this.getNodeParameter('fromEmail', itemIndex) as string;
				const toEmail = this.getNodeParameter('toEmail', itemIndex) as string;
				const ccEmail = this.getNodeParameter('ccEmail', itemIndex) as string;
				const bccEmail = this.getNodeParameter('bccEmail', itemIndex) as string;
				const subject = this.getNodeParameter('subject', itemIndex) as string;
				const text = this.getNodeParameter('text', itemIndex) as string;
				const html = this.getNodeParameter('html', itemIndex) as string;
				const attachmentPropertyString = this.getNodeParameter('attachments', itemIndex) as string;
				const options = this.getNodeParameter('options', itemIndex, {});

				const credentials = await this.getCredentials('smtp');

				const connectionOptions: SMTPTransport.Options = {
					host: credentials.host as string,
					port: credentials.port as number,
					secure: credentials.secure as boolean,
				};

				if (credentials.user || credentials.password) {
					connectionOptions.auth = {
						user: credentials.user as string,
						pass: credentials.password as string,
					};
				}

				if (options.allowUnauthorizedCerts === true) {
					connectionOptions.tls = {
						rejectUnauthorized: false,
					};
				}

				const transporter = createTransport(connectionOptions);

				// setup email data with unicode symbols
				const mailOptions: IDataObject = {
					from: fromEmail,
					to: toEmail,
					cc: ccEmail,
					bcc: bccEmail,
					subject,
					text,
					html,
					replyTo: options.replyTo as string | undefined,
				};

				if (attachmentPropertyString && item.binary) {
					const attachments = [];
					const attachmentProperties: string[] = attachmentPropertyString
						.split(',')
						.map((propertyName) => {
							return propertyName.trim();
						});

					for (const propertyName of attachmentProperties) {
						const binaryData = this.helpers.assertBinaryData(itemIndex, propertyName);
						attachments.push({
							filename: binaryData.fileName || 'unknown',
							content: await this.helpers.getBinaryDataBuffer(itemIndex, propertyName),
						});
					}

					if (attachments.length) {
						mailOptions.attachments = attachments;
					}
				}

				// Send the email
				const info = await transporter.sendMail(mailOptions);

				returnData.push({
					json: info as unknown as IDataObject,
					pairedItem: {
						item: itemIndex,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: itemIndex,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
