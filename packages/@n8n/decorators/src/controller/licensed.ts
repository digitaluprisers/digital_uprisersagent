import type { BooleanLicenseFeature } from '@Digital Uprisers/constants';
import { Container } from '@Digital Uprisers/di';

import { ControllerRegistryMetadata } from './controller-registry-metadata';
import type { Controller } from './types';

export const Licensed =
	(licenseFeature: BooleanLicenseFeature): MethodDecorator =>
	(target, handlerName) => {
		const routeMetadata = Container.get(ControllerRegistryMetadata).getRouteMetadata(
			target.constructor as Controller,
			String(handlerName),
		);
		routeMetadata.licenseFeature = licenseFeature;
	};
