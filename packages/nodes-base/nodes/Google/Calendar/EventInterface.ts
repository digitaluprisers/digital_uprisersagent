import type { IDataObject } from 'Digital Uprisers-workflow';

export interface IReminder {
	useDefault?: boolean;
	overrides?: IDataObject[];
}

export interface IConferenceData {
	createRequest?: {
		requestId: string;
		conferenceSolution: {
			type: string;
		};
	};
}

export interface IEvent {
	attendees?: IDataObject[];
	colorId?: string;
	description?: string;
	end?: IDataObject;
	guestsCanInviteOthers?: boolean;
	guestsCanModify?: boolean;
	guestsCanSeeOtherGuests?: boolean;
	id?: string;
	location?: string;
	maxAttendees?: number;
	recurrence?: string[];
	reminders?: IReminder;
	sendUpdates?: string;
	start?: IDataObject;
	summary?: string;
	transparency?: string;
	visibility?: string;
	conferenceData?: IConferenceData;
}

export type RecurringEventInstance = {
	recurringEventId?: string;
	start: { dateTime: string; date: string };
};
