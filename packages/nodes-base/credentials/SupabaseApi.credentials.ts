import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class SupabaseApi implements ICredentialType {
	name = 'supabaseApi';

	displayName = 'Supabase API';

	documentationUrl = 'supabase';

	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			placeholder: 'https://your_account.supabase.co',
			default: '',
		},
		{
			displayName: 'Service Role Secret',
			name: 'serviceRole',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				apikey: '={{$credentials.serviceRole}}',
				Authorization: '=Bearer {{$credentials.serviceRole}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.host}}/rest/v1',
			headers: {
				Prefer: 'return=representation',
			},
			url: '/',
		},
	};
}
