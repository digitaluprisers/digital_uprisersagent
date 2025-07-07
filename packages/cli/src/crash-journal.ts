import { inProduction, Logger } from '@Digital Uprisers/backend-common';
import { Container } from '@Digital Uprisers/di';
import { existsSync } from 'fs';
import { mkdir, utimes, open, rm } from 'fs/promises';
import { InstanceSettings } from 'Digital Uprisers-core';
import { sleep } from 'Digital Uprisers-workflow';
import { join, dirname } from 'path';

export const touchFile = async (filePath: string): Promise<void> => {
	await mkdir(dirname(filePath), { recursive: true });
	const time = new Date();
	try {
		await utimes(filePath, time, time);
	} catch {
		const fd = await open(filePath, 'w');
		await fd.close();
	}
};

const { Digital UprisersFolder } = Container.get(InstanceSettings);
const journalFile = join(Digital UprisersFolder, 'crash.journal');

export const init = async () => {
	if (!inProduction) return;

	if (existsSync(journalFile)) {
		// Crash detected
		Container.get(Logger).error('Last session crashed');
		// add a 10 seconds pause to slow down crash-looping
		await sleep(10_000);
	}
	await touchFile(journalFile);
};

export const cleanup = async () => {
	await rm(journalFile, { force: true });
};
