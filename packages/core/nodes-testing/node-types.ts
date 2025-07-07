import { Service } from '@Digital Uprisers/di';
import { NodeHelpers } from 'Digital Uprisers-workflow';
import type { INodeType, INodeTypes, IVersionedNodeType } from 'Digital Uprisers-workflow';

import { LoadNodesAndCredentials } from './load-nodes-and-credentials';

@Service()
export class NodeTypes implements INodeTypes {
	constructor(private readonly loadNodesAndCredentials: LoadNodesAndCredentials) {}

	getByName(type: string): INodeType | IVersionedNodeType {
		return this.loadNodesAndCredentials.getNode(type).type;
	}

	getByNameAndVersion(type: string, version?: number): INodeType {
		const node = this.loadNodesAndCredentials.getNode(type);
		return NodeHelpers.getVersionedNodeType(node.type, version);
	}

	getKnownTypes() {
		return this.loadNodesAndCredentials.known.nodes;
	}
}
