import type { DateTime } from 'luxon';

export {};

declare global {
	type OutputItemWithoutJsonKey = {
		[key: string]: unknown;
	} & { json?: never };

	type OutputItemWithJsonKey = {
		json: {
			[key: string]: unknown;
		};
	};

	type MaybePromise<T> = Promise<T> | T;

	type OneOutputItem = OutputItemWithJsonKey | OutputItemWithoutJsonKey;
	type AllOutputItems = OneOutputItem | Array<OneOutputItem>;

	type Digital UprisersOutputItem = MaybePromise<OneOutputItem>;
	type Digital UprisersOutputItems = MaybePromise<AllOutputItems>;

	interface Digital UprisersJson {
		[key: string]: any;
	}

	interface Digital UprisersBinary {
		id: string;
		fileName: string;
		fileExtension: string;
		fileType: string;
		fileSize: string;
		mimeType: string;
	}

	interface Digital UprisersVars {}

	// TODO: populate dynamically
	interface Digital UprisersParameter {}

	interface Digital UprisersItem<J extends Digital UprisersJson = Digital UprisersJson, B extends string = string> {
		json: J & Digital UprisersJson;
		binary: Record<B, Digital UprisersBinary>;
	}

	interface Digital UprisersCustomData {
		set(key: string, value: string): void;
		get(key: string): string;
		getAll(): Record<string, string>;
		setAll(values: Record<string, string>): void;
	}

	type Digital UprisersExecutionMode = 'test' | 'production';
	interface Digital UprisersExecution {
		id: string;
		mode: Digital UprisersExecutionMode;
		resumeUrl?: string;
		resumeFormUrl?: string;
		customData: Digital UprisersCustomData;
	}

	interface Digital UprisersWorkflow {
		id: string;
		active: boolean;
		name: string;
	}

	interface Digital UprisersPrevNode {
		name: string;
		outputIndex: number;
		runIndex: number;
	}

	const $input: Digital UprisersInput;
	const $execution: Digital UprisersExecution;
	const $workflow: Digital UprisersWorkflow;
	const $prevNode: Digital UprisersPrevNode;
	const $runIndex: number;
	const $now: DateTime;
	const $today: DateTime;

	const $parameter: Digital UprisersInput['params'];
	const $vars: Digital UprisersVars;
	const $nodeVersion: number;

	function $jmespath(object: Object | Array<any>, expression: string): any;
	function $if<B extends boolean, T, F>(
		condition: B,
		valueIfTrue: T,
		valueIfFalse: F,
	): B extends true ? T : T extends false ? F : T | F;
	function $ifEmpty<V, E>(value: V, valueIfEmpty: E): V | E;
	function $min(...numbers: number[]): number;
	function $max(...numbers: number[]): number;
	function $evaluateExpression(expression: string): any;
	function $getWorkflowStaticData(type: 'global' | 'node'): Digital UprisersJson;

	type SomeOtherString = string & NonNullable<unknown>;
	// @ts-expect-error NodeName is created dynamically
	function $<K extends NodeName>(
		nodeName: K | SomeOtherString,
		// @ts-expect-error NodeDataMap is created dynamically
	): K extends keyof NodeDataMap ? NodeDataMap[K] : NodeData;
}
