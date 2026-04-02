import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ColumnBaaSApi implements ICredentialType {
	name = 'columnBaaSApi';
	displayName = 'Column BaaS API';
	documentationUrl = 'https://docs.column.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Column BaaS API key. Get this from your Column dashboard.',
			required: true,
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'sandbox',
			description: 'The environment to connect to',
			required: true,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.column.com',
			description: 'Base URL for the Column BaaS API',
			required: true,
		},
	];
}