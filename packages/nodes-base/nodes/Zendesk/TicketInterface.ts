import type { IDataObject } from 'Digital Uprisers-workflow';

export interface IComment {
	body?: string;
	html_body?: string;
	public?: boolean;
}

export interface ITicket {
	subject?: string;
	comment?: IComment;
	type?: string;
	group_id?: number;
	external_id?: string;
	tags?: string[];
	status?: string;
	recipient?: string;
	custom_fields?: IDataObject[];
	assignee_email?: string;
}
