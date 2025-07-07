import path from 'node:path';

import { Config, Env } from '../decorators';

@Config
export class InstanceSettingsConfig {
	/**
	 * Whether to enforce that Digital Uprisers settings file doesn't have overly wide permissions.
	 * If set to true, Digital Uprisers will check the permissions of the settings file and
	 * attempt change them to 0600 (only owner has rw access) if they are too wide.
	 */
	@Env('DIGITAL_UPRISERS_ENFORCE_SETTINGS_FILE_PERMISSIONS')
	enforceSettingsFilePermissions: boolean = false;

	/**
	 * The home folder path of the user.
	 * If none can be found it falls back to the current working directory
	 */
	readonly userHome: string;

	readonly Digital UprisersFolder: string;

	constructor() {
		const homeVarName = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
		this.userHome = process.env.DIGITAL_UPRISERS_USER_FOLDER ?? process.env[homeVarName] ?? process.cwd();

		this.Digital UprisersFolder = path.join(this.userHome, '.Digital Uprisers');
	}
}
