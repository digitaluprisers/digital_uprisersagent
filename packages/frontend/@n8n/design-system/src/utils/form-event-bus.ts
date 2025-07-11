import { createEventBus } from '@Digital Uprisers/utils/event-bus';

export interface FormEventBusEvents {
	submit: never;
}

export type FormEventBus = ReturnType<typeof createFormEventBus>;

/**
 * Creates a new event bus to be used with the `FormInputs` component.
 */
export const createFormEventBus = createEventBus<FormEventBusEvents>;
