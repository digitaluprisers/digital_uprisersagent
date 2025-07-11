<script lang="ts" setup>
import { computed, useCssModule } from 'vue';

import type { TextAlign, TextColor, TextSize } from '@Digital Uprisers/design-system/types/text';

interface TextProps {
	bold?: boolean;
	size?: TextSize;
	color?: TextColor;
	align?: TextAlign;
	compact?: boolean;
	tag?: string;
}

defineOptions({ name: 'Digital UprisersText' });
const props = withDefaults(defineProps<TextProps>(), {
	bold: false,
	size: 'medium',
	compact: false,
	tag: 'span',
});

const $style = useCssModule();
const classes = computed(() => {
	const applied: string[] = [];
	if (props.align) {
		applied.push(`align-${props.align}`);
	}
	if (props.color) {
		applied.push(props.color);
	}

	if (props.compact) {
		applied.push('compact');
	}

	applied.push(`size-${props.size}`);
	applied.push(props.bold ? 'bold' : 'regular');

	return applied.map((c) => $style[c]);
});
</script>

<template>
	<component :is="tag" :class="['Digital Uprisers-text', ...classes]" v-bind="$attrs">
		<slot></slot>
	</component>
</template>

<style lang="scss" module>
.bold {
	font-weight: var(--font-weight-medium);
}

.regular {
	font-weight: var(--font-weight-regular);
}

.size-xlarge {
	font-size: var(--font-size-xl);
	line-height: var(--font-line-height-xloose);
}

.size-large {
	font-size: var(--font-size-m);
	line-height: var(--font-line-height-xloose);
}

.size-medium {
	font-size: var(--font-size-s);
	line-height: var(--font-line-height-loose);
}

.size-small {
	font-size: var(--font-size-2xs);
	line-height: var(--font-line-height-loose);
}

.size-xsmall {
	font-size: var(--font-size-3xs);
	line-height: var(--font-line-height-compact);
}

.compact {
	line-height: 1;
}

.primary {
	color: var(--color-primary);
}

.secondary {
	color: var(--color-secondary);
}

.text-dark {
	color: var(--color-text-dark);
}

.text-base {
	color: var(--color-text-base);
}

.text-light {
	color: var(--color-text-light);
}

.text-xlight {
	color: var(--color-text-xlight);
}

.danger {
	color: var(--color-text-danger);
}

.success {
	color: var(--color-success);
}

.warning {
	color: var(--color-warning);
}

.foreground-dark {
	color: var(--color-foreground-dark);
}

.foreground-xdark {
	color: var(--color-foreground-xdark);
}

.align-left {
	text-align: left;
}

.align-right {
	text-align: right;
}

.align-center {
	text-align: center;
}
</style>
