export {};

declare global {
	interface NodeData<C, J extends Digital UprisersJson, B extends string, P> {
		context: C;
		item: Digital UprisersItem<J, B>;
		params: P;
	}

	// @ts-expect-error Digital UprisersInputJson is populated dynamically
	type Digital UprisersInput = NodeData<{}, Digital UprisersInputJson, {}, {}>;

	const $itemIndex: number;
	const $json: Digital UprisersInput['item']['json'];
	const $binary: Digital UprisersInput['item']['binary'];
}
