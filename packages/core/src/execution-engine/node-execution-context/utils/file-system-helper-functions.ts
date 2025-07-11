import { Container } from '@Digital Uprisers/di';
import type { FileSystemHelperFunctions, INode } from 'Digital Uprisers-workflow';
import { NodeOperationError } from 'Digital Uprisers-workflow';
import { createReadStream } from 'node:fs';
import { access as fsAccess, writeFile as fsWriteFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import {
	BINARY_DATA_STORAGE_PATH,
	BLOCK_FILE_ACCESS_TO_DIGITAL_UPRISERS_FILES,
	CONFIG_FILES,
	CUSTOM_EXTENSION_ENV,
	RESTRICT_FILE_ACCESS_TO,
	UM_EMAIL_TEMPLATES_INVITE,
	UM_EMAIL_TEMPLATES_PWRESET,
} from '@/constants';
import { InstanceSettings } from '@/instance-settings';

const getAllowedPaths = () => {
	const restrictFileAccessTo = process.env[RESTRICT_FILE_ACCESS_TO];
	if (!restrictFileAccessTo) {
		return [];
	}
	const allowedPaths = restrictFileAccessTo
		.split(';')
		.map((path) => path.trim())
		.filter((path) => path);
	return allowedPaths;
};

export function isFilePathBlocked(filePath: string): boolean {
	const allowedPaths = getAllowedPaths();
	const resolvedFilePath = resolve(filePath);
	const blockFileAccessToDigital UprisersFiles = process.env[BLOCK_FILE_ACCESS_TO_DIGITAL_UPRISERS_FILES] !== 'false';

	//if allowed paths are defined, allow access only to those paths
	if (allowedPaths.length) {
		for (const path of allowedPaths) {
			if (resolvedFilePath.startsWith(path)) {
				return false;
			}
		}

		return true;
	}

	//restrict access to .Digital Uprisers folder, ~/.cache/Digital Uprisers/public, and other .env config related paths
	if (blockFileAccessToDigital UprisersFiles) {
		const { Digital UprisersFolder, staticCacheDir } = Container.get(InstanceSettings);
		const restrictedPaths = [Digital UprisersFolder, staticCacheDir];

		if (process.env[CONFIG_FILES]) {
			restrictedPaths.push(...process.env[CONFIG_FILES].split(','));
		}

		if (process.env[CUSTOM_EXTENSION_ENV]) {
			const customExtensionFolders = process.env[CUSTOM_EXTENSION_ENV].split(';');
			restrictedPaths.push(...customExtensionFolders);
		}

		if (process.env[BINARY_DATA_STORAGE_PATH]) {
			restrictedPaths.push(process.env[BINARY_DATA_STORAGE_PATH]);
		}

		if (process.env[UM_EMAIL_TEMPLATES_INVITE]) {
			restrictedPaths.push(process.env[UM_EMAIL_TEMPLATES_INVITE]);
		}

		if (process.env[UM_EMAIL_TEMPLATES_PWRESET]) {
			restrictedPaths.push(process.env[UM_EMAIL_TEMPLATES_PWRESET]);
		}

		//check if the file path is restricted
		for (const path of restrictedPaths) {
			if (resolvedFilePath.startsWith(path)) {
				return true;
			}
		}
	}

	//path is not restricted
	return false;
}

export const getFileSystemHelperFunctions = (node: INode): FileSystemHelperFunctions => ({
	async createReadStream(filePath) {
		try {
			await fsAccess(filePath);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			throw error.code === 'ENOENT'
				? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					new NodeOperationError(node, error, {
						message: `The file "${String(filePath)}" could not be accessed.`,
						level: 'warning',
					})
				: error;
		}
		if (isFilePathBlocked(filePath as string)) {
			const allowedPaths = getAllowedPaths();
			const message = allowedPaths.length ? ` Allowed paths: ${allowedPaths.join(', ')}` : '';
			throw new NodeOperationError(node, `Access to the file is not allowed.${message}`, {
				level: 'warning',
			});
		}
		return createReadStream(filePath);
	},

	getStoragePath() {
		return join(Container.get(InstanceSettings).Digital UprisersFolder, `storage/${node.type}`);
	},

	async writeContentToFile(filePath, content, flag) {
		if (isFilePathBlocked(filePath as string)) {
			throw new NodeOperationError(node, `The file "${String(filePath)}" is not writable.`, {
				level: 'warning',
			});
		}
		return await fsWriteFile(filePath, content, { encoding: 'binary', flag });
	},
});
