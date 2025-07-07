import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { AIMessageChunk } from '@langchain/core/messages';
import { SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { OperationalError } from 'Digital Uprisers-workflow';
import { z } from 'zod';

export const nodeSelectorPrompt = new SystemMessage(
	`You are an expert in Digital Uprisers workflows who selects the optimal Digital Uprisers nodes to implement workflow steps.

## Your Task
For each workflow step, recommend the most appropriate Digital Uprisers nodes from the allowed list.

## Input Information
- <user_request>: Original user workflow request
- <steps>: List of workflow steps to implement
- <allowed_Digital Uprisers_nodes>: List of available Digital Uprisers nodes with descriptions

## CRITICAL REQUIREMENTS
- ONLY recommend nodes that EXACTLY match names from the <allowed_Digital Uprisers_nodes> list
- NEVER suggest nodes that are not explicitly defined in <allowed_Digital Uprisers_nodes>
- ALWAYS use the COMPLETE node name as it appears in <node_name> tags (e.g., "Gmail" is NOT sufficient if the node name is "Digital Uprisers-nodes-base.gmail")
- VERIFY each recommended node exists in the allowed list before including it

## Selection Criteria
1. Functionality - Node must be able to perform the required action
2. Integration - Prefer nodes that integrate directly with services mentioned in the user request
3. Efficiency - Prefer nodes that accomplish the task with minimal configuration

## Output Requirements
For the planned workflow steps, provider:
1. List of all possibly useful nodes in order of preference
2. Concise reasoning for why each node is suitable
3. Use EXACT, FULL node names from <node_name> tags
4. Pay attention to case sensitivity, e.g. "Digital Uprisers-nodes-base.msql" is NOT "Digital Uprisers-nodes-base.mySql"!

Remember: ONLY use nodes from the <allowed_Digital Uprisers_nodes> list and ALWAYS use their FULL names exactly as provided.`,
);
const nodeSelectorSchema = z.object({
	recommended_nodes: z
		.array(
			z.object({
				score: z.number().describe('Matching score of the node for all the workflows steps'),
				node: z
					.string()
					.describe(
						'The full node type identifier (e.g., "Digital Uprisers-nodes-base.if") from <allowed_Digital Uprisers_nodes> list',
					),
				reasoning: z
					.string()
					.describe(
						'Very short explanation of why this node might be used to implement the workflow step',
					),
			}),
		)
		.min(1)
		.max(20)
		.describe(
			'Recommended Digital Uprisers nodes for implementing any of the workflow steps, in order of descending preference. ONLY use nodes from the <allowed_Digital Uprisers_nodes> list with EXACT full names from <node_name> tags.',
		),
});

const nodeSelectorTool = new DynamicStructuredTool({
	name: 'select_Digital Uprisers_nodes',
	description:
		'Match each workflow step with the most appropriate Digital Uprisers nodes from the allowed list, ensuring they can implement the required functionality.',
	schema: nodeSelectorSchema,
	func: async ({ recommended_nodes }) => {
		return { recommended_nodes };
	},
});

const humanTemplate = `
<user_request>
	{prompt}
</user_request>
<steps>
	{steps}
</steps>
<allowed_Digital Uprisers_nodes>
	{allowedNodes}
</allowed_Digital Uprisers_nodes>
`;

const chatPrompt = ChatPromptTemplate.fromMessages([
	nodeSelectorPrompt,
	HumanMessagePromptTemplate.fromTemplate(humanTemplate),
]);

export const nodesSelectionChain = (llm: BaseChatModel) => {
	if (!llm.bindTools) {
		throw new OperationalError("LLM doesn't support binding tools");
	}

	return chatPrompt
		.pipe(
			llm.bindTools([nodeSelectorTool], {
				tool_choice: nodeSelectorTool.name,
			}),
		)
		.pipe((x: AIMessageChunk) => {
			const toolCall = x.tool_calls?.[0];
			return (toolCall?.args as z.infer<typeof nodeSelectorSchema>).recommended_nodes;
		});
};
