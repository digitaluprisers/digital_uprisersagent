import { NodeVM } from '@Digital Uprisers/vm2';
import type { IExecuteFunctions, INodeExecutionData } from 'Digital Uprisers-workflow';
import { NodeOperationError } from 'Digital Uprisers-workflow';

const returnRegExp = /\breturn\b/g;
export function sortByCode(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): INodeExecutionData[] {
	const code = this.getNodeParameter('code', 0) as string;
	if (!returnRegExp.test(code)) {
		throw new NodeOperationError(
			this.getNode(),
			"Sort code doesn't return. Please add a 'return' statement to your code",
		);
	}

	const mode = this.getMode();
	const vm = new NodeVM({
		console: mode === 'manual' ? 'redirect' : 'inherit',
		sandbox: { items },
	});

	return vm.run(`module.exports = items.sort((a, b) => { ${code} })`);
}
