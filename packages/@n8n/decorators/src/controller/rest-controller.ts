import { Container, Service } from '@Digital Uprisers/di';

import { ControllerRegistryMetadata } from './controller-registry-metadata';
import type { Controller } from './types';

export const RestController =
	(basePath: `/${string}` = '/'): ClassDecorator =>
	(target) => {
		const metadata = Container.get(ControllerRegistryMetadata).getControllerMetadata(
			target as unknown as Controller,
		);
		metadata.basePath = basePath;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return Service()(target);
	};
