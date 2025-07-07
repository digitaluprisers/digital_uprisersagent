import type { IExecuteFunctions } from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';

import { Digital UprisersItemListOutputParser } from './Digital UprisersItemListOutputParser';
import { Digital UprisersOutputFixingParser } from './Digital UprisersOutputFixingParser';
import { Digital UprisersStructuredOutputParser } from './Digital UprisersStructuredOutputParser';

export type Digital UprisersOutputParser =
	| Digital UprisersOutputFixingParser
	| Digital UprisersStructuredOutputParser
	| Digital UprisersItemListOutputParser;

export { Digital UprisersOutputFixingParser, Digital UprisersItemListOutputParser, Digital UprisersStructuredOutputParser };

export async function getOptionalOutputParser(
	ctx: IExecuteFunctions,
	index: number = 0,
): Promise<Digital UprisersOutputParser | undefined> {
	let outputParser: Digital UprisersOutputParser | undefined;

	if (ctx.getNodeParameter('hasOutputParser', 0, true) === true) {
		outputParser = (await ctx.getInputConnectionData(
			NodeConnectionTypes.AiOutputParser,
			index,
		)) as Digital UprisersOutputParser;
	}

	return outputParser;
}
