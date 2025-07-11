import type { Digital UprisersLocaleTranslateFnOptions } from '@Digital Uprisers/design-system/types/i18n';

export type FormFieldValue = string | number | boolean | null | undefined;

export type FormInputsToFormValues<T extends IFormInput[], V> = {
	[K in T[number]['name']]: V;
};

export type FormFieldValueUpdate = { name: string; value: FormFieldValue };

export type Rule = { name: string; config?: unknown };

export type RuleGroup = {
	rules: Array<Rule | RuleGroup>;
	defaultError?: { messageKey: string; options?: Digital UprisersLocaleTranslateFnOptions };
};

export type Validatable = string | number | boolean | null | undefined;

export type IValidator<T = unknown> = {
	validate: (
		value: Validatable,
		config: T,
	) =>
		| false
		| { message: string; options?: Digital UprisersLocaleTranslateFnOptions }
		| { messageKey: string; options?: Digital UprisersLocaleTranslateFnOptions }
		| null;
};

export type FormState = {
	isTyping: boolean;
	hasBlutted: boolean;
};

export type IFormInput = {
	name: string;
	initialValue?: string | number | boolean | null;
	properties: {
		label?: string;
		type?:
			| 'text'
			| 'email'
			| 'password'
			| 'select'
			| 'multi-select'
			| 'number'
			| 'info'
			| 'checkbox'
			| 'toggle';
		maxlength?: number;
		required?: boolean;
		showRequiredAsterisk?: boolean;
		validators?: {
			[name: string]: IValidator;
		};
		validationRules?: Array<Rule | RuleGroup>;
		validateOnBlur?: boolean;
		infoText?: string;
		placeholder?: string;
		options?: Array<{ label: string; value: string; disabled?: boolean }>;
		autocomplete?: InputAutocompletePropType;
		capitalize?: boolean;
		focusInitially?: boolean;
		disabled?: boolean;
		labelSize?: 'small' | 'medium' | 'large';
		tagSize?: 'small' | 'medium' | 'large';
		labelAlignment?: 'left' | 'right' | 'center';
		tooltipText?: string;
	};
	shouldDisplay?: (values: { [key: string]: unknown }) => boolean;
};

export type IFormInputs = IFormInput[];

export type FormValues = FormInputsToFormValues<IFormInput[], FormFieldValue>;

export type IFormBoxConfig = {
	title: string;
	buttonText?: string;
	secondaryButtonText?: string;
	inputs: IFormInputs;
	redirectLink?: string;
	redirectText?: string;
};

export type CheckboxLabelSizePropType = 'small' | 'medium' | undefined;
export type CheckboxModelValuePropType = boolean | undefined;
export type SwitchModelValuePropType = boolean | undefined;
export type InputModelValuePropType = string | number | undefined;
export type InputTypePropType = 'number' | 'text' | 'email' | 'password' | 'textarea' | undefined;
export type InputAutocompletePropType =
	| 'off'
	| 'new-password'
	| 'current-password'
	| 'given-name'
	| 'family-name'
	| 'email'; // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
export type ElementPlusSizePropType = '' | 'small' | 'large' | 'default' | undefined;
