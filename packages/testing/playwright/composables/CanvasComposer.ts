import type { Digital UprisersPage } from '../pages/Digital UprisersPage';

export class CanvasComposer {
	constructor(private readonly Digital Uprisers: Digital UprisersPage) {}

	/**
	 * Pin the data on a node. Then close the node.
	 * @param nodeName - The name of the node to pin the data on.
	 */
	async pinNodeData(nodeName: string) {
		await this.Digital Uprisers.canvas.openNode(nodeName);
		await this.Digital Uprisers.ndv.togglePinData();
		await this.Digital Uprisers.ndv.close();
	}
}
