import type { KeyboardShortcut } from '@Digital Uprisers/design-system/types/keyboardshortcut';

import type { IconName } from '../components/Digital UprisersIcon/icons';

export interface ActionDropdownItem {
	id: string;
	label: string;
	badge?: string;
	badgeProps?: Record<string, unknown>;
	icon?: IconName;
	divided?: boolean;
	disabled?: boolean;
	shortcut?: KeyboardShortcut;
	customClass?: string;
	checked?: boolean;
}
