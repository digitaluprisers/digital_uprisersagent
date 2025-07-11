<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

import type { TextSize } from '@Digital Uprisers/design-system/types/text';

import Digital UprisersRoute from '../Digital UprisersRoute';
import Digital UprisersText from '../Digital UprisersText';

const THEME = ['primary', 'danger', 'text', 'secondary'] as const;

interface LinkProps {
	to?: RouteLocationRaw | string;
	size?: TextSize;
	newWindow?: boolean;
	bold?: boolean;
	underline?: boolean;
	theme?: (typeof THEME)[number];
}

defineOptions({ name: 'Digital UprisersLink' });
withDefaults(defineProps<LinkProps>(), {
	to: undefined,
	size: undefined,
	bold: false,
	underline: false,
	theme: 'primary',
});
</script>

<template>
	<Digital UprisersRoute :to="to" :new-window="newWindow" v-bind="$attrs" class="Digital Uprisers-link">
		<span :class="$style[`${underline ? `${theme}-underline` : theme}`]">
			<Digital UprisersText :size="size" :bold="bold">
				<slot></slot>
			</Digital UprisersText>
		</span>
	</Digital UprisersRoute>
</template>

<style lang="scss" module>
@import '../../utils';
@import '../../css/common/var';

.primary {
	color: $link-color;

	&:active {
		color: $link-color-active;
	}
}

.text {
	color: var(--color-text-base);

	&:hover {
		color: $link-color;
	}

	&:active {
		color: $link-color-active;
	}
}

.danger {
	color: var(--color-danger);

	&:active {
		color: var(--color-danger-shade-1);
	}
}

.secondary {
	color: var(--color-secondary-link);

	&:active {
		color: var(--color-secondary-link-hover);
	}
}

.primary-underline {
	composes: primary;
	text-decoration: underline;
}

.text-underline {
	composes: text;
	text-decoration: underline;
}

.danger-underline {
	composes: danger;
	text-decoration: underline;
}

.secondary-underline {
	composes: secondary;
	text-decoration: underline;
}
</style>
