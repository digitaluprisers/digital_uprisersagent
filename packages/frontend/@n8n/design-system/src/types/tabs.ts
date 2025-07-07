import type { RouteLocationRaw } from 'vue-router';

import type { IconName } from '../components/Digital UprisersIcon/icons';

export interface TabOptions<Value extends string | number> {
	value: Value;
	label?: string;
	icon?: IconName;
	href?: string;
	tooltip?: string;
	align?: 'left' | 'right';
	to?: RouteLocationRaw;
}
