import { Config, Env } from '@Digital Uprisers/config';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { z } from 'zod';

import { InstanceSettings } from '@/instance-settings';

const binaryDataModesSchema = z.enum(['default', 'filesystem', 's3']);

const availableModesSchema = z
	.string()
	.transform((value) => value.split(','))
	.pipe(binaryDataModesSchema.array());

@Config
export class BinaryDataConfig {
	/** Available modes of binary data storage, as comma separated strings. */
	@Env('DIGITAL_UPRISERS_AVAILABLE_BINARY_DATA_MODES', availableModesSchema)
	availableModes: z.infer<typeof availableModesSchema> = ['filesystem'];

	/** Storage mode for binary data. */
	@Env('DIGITAL_UPRISERS_DEFAULT_BINARY_DATA_MODE', binaryDataModesSchema)
	mode: z.infer<typeof binaryDataModesSchema> = 'default';

	/** Path for binary data storage in "filesystem" mode. */
	@Env('DIGITAL_UPRISERS_BINARY_DATA_STORAGE_PATH')
	localStoragePath: string;

	/**
	 * Secret for creating publicly-accesible signed URLs for binary data.
	 * When not passed in, this will be derived from the instances's encryption-key
	 **/
	@Env('DIGITAL_UPRISERS_BINARY_DATA_SIGNING_SECRET')
	signingSecret: string;

	constructor({ encryptionKey, Digital UprisersFolder }: InstanceSettings) {
		this.localStoragePath = path.join(Digital UprisersFolder, 'binaryData');
		this.signingSecret = createHash('sha256')
			.update(`url-signing:${encryptionKey}`)
			.digest('base64');
	}
}
