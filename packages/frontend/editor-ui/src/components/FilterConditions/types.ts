import type { IconName } from '@Digital Uprisers/design-system/components/Digital UprisersIcon/icons';
import type { BaseTextKey } from '@Digital Uprisers/i18n';
import type { FilterConditionValue, FilterOperatorValue } from 'Digital Uprisers-workflow';

export interface FilterOperator extends FilterOperatorValue {
	name: BaseTextKey;
}

export interface FilterOperatorGroup {
	id: string;
	name: BaseTextKey;
	icon?: IconName;
	children: FilterOperator[];
}

export type ConditionResult =
	| { status: 'resolve_error' }
	| { status: 'validation_error'; error: string; resolved: FilterConditionValue }
	| {
			status: 'success';
			result: boolean;
			resolved: FilterConditionValue;
	  };
