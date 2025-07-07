export {};

declare global {
	interface NodeData<C = any, J extends Digital UprisersJson = any, B extends string = string, P = any> {
		context: C;
		params: P;
		all(branchIndex?: number, runIndex?: number): Array<Digital UprisersItem<J, B>>;
		first(branchIndex?: number, runIndex?: number): Digital UprisersItem<J, B>;
		last(branchIndex?: number, runIndex?: number): Digital UprisersItem<J, B>;
		itemMatching(itemIndex: number): Digital UprisersItem<J, B>;
	}

	// @ts-expect-error Digital UprisersInputJson is populated dynamically
	type Digital UprisersInput = NodeData<Digital UprisersInputContext, Digital UprisersInputJson, Digital UprisersInputBinaryKeys, Digital UprisersInputParams>;
}
