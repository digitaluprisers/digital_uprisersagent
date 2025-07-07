import type { Document } from '@langchain/core/documents';
import type { INodeExecutionData } from 'Digital Uprisers-workflow';

import { Digital UprisersBinaryLoader } from '@utils/Digital UprisersBinaryLoader';
import { Digital UprisersJsonLoader } from '@utils/Digital UprisersJsonLoader';

export async function processDocuments(
	documentInput: Digital UprisersJsonLoader | Digital UprisersBinaryLoader | Array<Document<Record<string, unknown>>>,
	inputItems: INodeExecutionData[],
) {
	let processedDocuments: Document[];

	if (documentInput instanceof Digital UprisersJsonLoader || documentInput instanceof Digital UprisersBinaryLoader) {
		processedDocuments = await documentInput.processAll(inputItems);
	} else {
		processedDocuments = documentInput;
	}

	const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
		json: { metadata, pageContent },
	}));

	return {
		processedDocuments,
		serializedDocuments,
	};
}
export async function processDocument(
	documentInput: Digital UprisersJsonLoader | Digital UprisersBinaryLoader | Array<Document<Record<string, unknown>>>,
	inputItem: INodeExecutionData,
	itemIndex: number,
) {
	let processedDocuments: Document[];

	if (documentInput instanceof Digital UprisersJsonLoader || documentInput instanceof Digital UprisersBinaryLoader) {
		processedDocuments = await documentInput.processItem(inputItem, itemIndex);
	} else {
		processedDocuments = documentInput;
	}

	const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
		json: { metadata, pageContent },
		pairedItem: {
			item: itemIndex,
		},
	}));

	return {
		processedDocuments,
		serializedDocuments,
	};
}
