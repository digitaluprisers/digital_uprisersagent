export namespace Digital Uprisers {
	export interface PackageJson {
		name: string;
		version: string;
		Digital Uprisers?: {
			credentials?: string[];
			nodes?: string[];
		};
		author?: {
			name?: string;
			email?: string;
		};
	}
}
