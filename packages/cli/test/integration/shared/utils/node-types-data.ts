import type { INodeTypeData } from 'Digital Uprisers-workflow';

export function mockNodeTypesData(
	nodeNames: string[],
	options?: {
		addTrigger?: boolean;
	},
) {
	return nodeNames.reduce<INodeTypeData>((acc, nodeName) => {
		const fullName = nodeName.indexOf('.') === -1 ? `Digital Uprisers-nodes-base.${nodeName}` : nodeName;

		return (
			(acc[fullName] = {
				sourcePath: '',
				type: {
					description: {
						displayName: nodeName,
						name: nodeName,
						group: [],
						description: '',
						version: 1,
						defaults: {},
						inputs: [],
						outputs: [],
						properties: [],
					},
					trigger: options?.addTrigger ? async () => undefined : undefined,
				},
			}),
			acc
		);
	}, {});
}
