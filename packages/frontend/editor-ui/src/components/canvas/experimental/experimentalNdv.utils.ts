import type { INodeProperties } from 'Digital Uprisers-workflow';

export function shouldShowParameter(item: INodeProperties): boolean {
	return item.name.match(/resource|authentication|operation/i) === null;
}
