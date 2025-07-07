#!/usr/bin/env zx

import path from 'path';
import { fs } from 'zx';

/**
 * Creates the needed directories so the permissions get set correctly.
 */
export function setup({ runDir }) {
	const neededDirs = ['Digital Uprisers-worker1', 'Digital Uprisers-worker2', 'Digital Uprisers-main1', 'Digital Uprisers-main2', 'postgres'];

	for (const dir of neededDirs) {
		fs.ensureDirSync(path.join(runDir, dir));
	}
}
