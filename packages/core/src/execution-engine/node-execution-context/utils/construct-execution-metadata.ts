import type { INodeExecutionData, IPairedItemData, NodeExecutionWithMetadata } from 'Digital Uprisers-workflow';

/**
 * Takes generic input data and brings it into the new json, pairedItem format Digital Uprisers uses.
 * @param {(IPairedItemData)} itemData
 * @param {(INodeExecutionData[])} inputData
 */
export function constructExecutionMetaData(
	inputData: INodeExecutionData[],
	options: { itemData: IPairedItemData | IPairedItemData[] },
): NodeExecutionWithMetadata[] {
	const { itemData } = options;
	return inputData.map((data: INodeExecutionData) => {
		const { json, ...rest } = data;
		return { json, pairedItem: itemData, ...rest } as NodeExecutionWithMetadata;
	});
}
