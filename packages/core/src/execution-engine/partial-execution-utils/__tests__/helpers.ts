import { NodeConnectionTypes } from 'Digital Uprisers-workflow';
import type {
	INodeParameters,
	INode,
	ITaskData,
	IDataObject,
	IConnections,
	NodeConnectionType,
} from 'Digital Uprisers-workflow';

interface StubNode {
	name: string;
	parameters?: INodeParameters;
	disabled?: boolean;
	type?: 'Digital Uprisers-nodes-base.manualTrigger' | 'Digital Uprisers-nodes-base.splitInBatches' | (string & {});
}

export function createNodeData(stubData: StubNode): INode {
	return {
		name: stubData.name,
		parameters: stubData.parameters ?? {},
		type: stubData.type ?? 'Digital Uprisers-nodes-base.set',
		typeVersion: 1,
		id: 'uuid-1234',
		position: [100, 100],
		disabled: stubData.disabled ?? false,
	};
}

type TaskData = {
	data: IDataObject;
	outputIndex?: number;
	nodeConnectionType?: NodeConnectionType;
};

export function toITaskData(taskData: TaskData[], overrides?: Partial<ITaskData>): ITaskData {
	const result: ITaskData = {
		executionStatus: 'success',
		executionTime: 0,
		startTime: 0,
		executionIndex: 0,
		source: [],
		data: {},
		...(overrides ?? {}),
	};

	// NOTE: Here to make TS happy.
	result.data = result.data ?? {};
	for (const taskDatum of taskData) {
		const type = taskDatum.nodeConnectionType ?? NodeConnectionTypes.Main;
		const outputIndex = taskDatum.outputIndex ?? 0;

		result.data[type] = result.data[type] ?? [];
		const dataConnection = result.data[type];
		dataConnection[outputIndex] = [{ json: taskDatum.data }];
	}

	for (const [type, dataConnection] of Object.entries(result.data)) {
		for (const [index, maybe] of dataConnection.entries()) {
			result.data[type][index] = maybe ?? null;
		}
	}

	return result;
}

export const nodeTypes = {
	getByName: jest.fn(),
	getByNameAndVersion: jest.fn(),
	getKnownTypes: jest.fn(),
};

export const defaultWorkflowParameter = {
	active: false,
	nodeTypes,
};

type Connection = {
	from: INode;
	to: INode;
	type?: NodeConnectionType;
	outputIndex?: number;
	inputIndex?: number;
};

export function toIConnections(connections: Connection[]): IConnections {
	const result: IConnections = {};

	for (const connection of connections) {
		const type = connection.type ?? NodeConnectionTypes.Main;
		const outputIndex = connection.outputIndex ?? 0;
		const inputIndex = connection.inputIndex ?? 0;

		result[connection.from.name] = result[connection.from.name] ?? {
			[type]: [],
		};
		const resultConnection = result[connection.from.name];
		resultConnection[type][outputIndex] = resultConnection[type][outputIndex] ?? [];
		const group = resultConnection[type][outputIndex];

		group.push({
			node: connection.to.name,
			type,
			index: inputIndex,
		});
	}

	return result;
}
