import type {
	INodeProperties,
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'Digital Uprisers-workflow';
import { ApplicationError, NodeOperationError, updateDisplayOptions } from 'Digital Uprisers-workflow';

import { apiRequest } from '../../transport';
import { assistantRLC, modelRLC } from '../descriptions';

const properties: INodeProperties[] = [
	assistantRLC,
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add Option',
		type: 'collection',
		default: {},
		options: [
			{
				displayName: 'Code Interpreter',
				name: 'codeInterpreter',
				type: 'boolean',
				default: false,
				description:
					'Whether to enable the code interpreter that allows the assistants to write and run Python code in a sandboxed execution environment, find more <a href="https://platform.openai.com/docs/assistants/tools/code-interpreter" target="_blank">here</a>',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the assistant. The maximum length is 512 characters.',
				placeholder: 'e.g. My personal assistant',
			},

			{
				// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Files',
				name: 'file_ids',
				type: 'multiOptions',
				// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-description-wrong-for-dynamic-multi-options
				description:
					'The files to be used by the assistant, there can be a maximum of 20 files attached to the assistant. You can use expression to pass file IDs as an array or comma-separated string.',
				typeOptions: {
					loadOptionsMethod: 'getFiles',
				},
				default: [],
				hint: "Add more files by using the 'Upload a File' operation, any existing files not selected here will be removed.",
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				description:
					'The system instructions that the assistant uses. The maximum length is 32768 characters.',
				default: '',
				typeOptions: {
					rows: 2,
				},
			},
			{
				displayName: 'Knowledge Retrieval',
				name: 'knowledgeRetrieval',
				type: 'boolean',
				default: false,
				description:
					'Whether to augments the assistant with knowledge from outside its model, such as proprietary product information or documents, find more <a href="https://platform.openai.com/docs/assistants/tools/knowledge-retrieval" target="_blank">here</a>',
			},
			{ ...modelRLC('modelSearch'), required: false },
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the assistant. The maximum length is 256 characters.',
				placeholder: 'e.g. My Assistant',
			},

			{
				displayName: 'Remove All Custom Tools (Functions)',
				name: 'removeCustomTools',
				type: 'boolean',
				default: false,
				description: 'Whether to remove all custom tools (functions) from the assistant',
			},

			{
				displayName: 'Output Randomness (Temperature)',
				name: 'temperature',
				default: 1,
				typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
				description:
					'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive. We generally recommend altering this or temperature but not both.',
				type: 'number',
			},
			{
				displayName: 'Output Randomness (Top P)',
				name: 'topP',
				default: 1,
				typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
				description:
					'An alternative to sampling with temperature, controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
				type: 'number',
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['update'],
		resource: ['assistant'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

function getFileIds(file_ids: unknown): string[] {
	if (Array.isArray(file_ids)) {
		return file_ids;
	}

	if (typeof file_ids === 'string') {
		return file_ids.split(',').map((file_id) => file_id.trim());
	}

	throw new ApplicationError('Invalid file_ids type');
}

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const assistantId = this.getNodeParameter('assistantId', i, '', { extractValue: true }) as string;
	const options = this.getNodeParameter('options', i, {});

	const {
		modelId,
		name,
		instructions,
		codeInterpreter,
		knowledgeRetrieval,
		file_ids,
		removeCustomTools,
		temperature,
		topP,
	} = options;

	const assistantDescription = options.description as string;

	const body: IDataObject = {};

	if (file_ids) {
		const files = getFileIds(file_ids);
		if (files.length > 20) {
			throw new NodeOperationError(
				this.getNode(),
				'The maximum number of files that can be attached to the assistant is 20',
				{ itemIndex: i },
			);
		}

		body.tool_resources = {
			...((body.tool_resources as object) ?? {}),
			code_interpreter: {
				file_ids: files,
			},
			// updating file_ids for file_search directly is not supported by OpenAI API
			// only updating vector_store_ids for file_search is supported
			// support for this to be added as part of ADO-2968
			// https://platform.openai.com/docs/api-reference/assistants/modifyAssistant
		};
	}

	if (modelId) {
		body.model = this.getNodeParameter('options.modelId', i, '', { extractValue: true }) as string;
	}

	if (name) {
		body.name = name;
	}

	if (assistantDescription) {
		body.description = assistantDescription;
	}

	if (instructions) {
		body.instructions = instructions;
	}

	if (temperature) {
		body.temperature = temperature;
	}

	if (topP) {
		body.topP = topP;
	}

	let tools =
		((
			await apiRequest.call(this, 'GET', `/assistants/${assistantId}`, {
				headers: {
					'OpenAI-Beta': 'assistants=v2',
				},
			})
		).tools as IDataObject[]) || [];

	if (codeInterpreter && !tools.find((tool) => tool.type === 'code_interpreter')) {
		tools.push({
			type: 'code_interpreter',
		});
	}

	if (codeInterpreter === false && tools.find((tool) => tool.type === 'code_interpreter')) {
		tools = tools.filter((tool) => tool.type !== 'code_interpreter');
	}

	if (knowledgeRetrieval && !tools.find((tool) => tool.type === 'file_search')) {
		tools.push({
			type: 'file_search',
		});
	}

	if (knowledgeRetrieval === false && tools.find((tool) => tool.type === 'file_search')) {
		tools = tools.filter((tool) => tool.type !== 'file_search');
	}

	if (removeCustomTools) {
		tools = tools.filter((tool) => tool.type !== 'function');
	}

	body.tools = tools;

	const response = await apiRequest.call(this, 'POST', `/assistants/${assistantId}`, {
		body,
		headers: {
			'OpenAI-Beta': 'assistants=v2',
		},
	});

	return [
		{
			json: response,
			pairedItem: { item: i },
		},
	];
}
