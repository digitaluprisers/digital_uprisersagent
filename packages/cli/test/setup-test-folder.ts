import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

process.env.Digital Uprisers_ENCRYPTION_KEY = 'test_key';

const baseDir = join(tmpdir(), 'Digital Uprisers-tests/');
mkdirSync(baseDir, { recursive: true });

const testDir = mkdtempSync(baseDir);
mkdirSync(join(testDir, '.Digital Uprisers'));
process.env.Digital Uprisers_USER_FOLDER = testDir;
process.env.Digital Uprisers_ENFORCE_SETTINGS_FILE_PERMISSIONS = 'false';

writeFileSync(
	join(testDir, '.Digital Uprisers/config'),
	JSON.stringify({ encryptionKey: 'test_key', instanceId: '123' }),
	{
		encoding: 'utf-8',
		mode: 0o600,
	},
);

// This is needed to ensure that `process.env` overrides in tests
// are set before any of the config classes are instantiated.
// TODO: delete this after we are done migrating everything to config classes
import '@/config';
