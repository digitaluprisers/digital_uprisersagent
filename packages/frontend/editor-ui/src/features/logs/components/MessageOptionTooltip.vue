<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
	placement: {
		type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
		default: 'top',
	},
});
</script>

<template>
	<div :class="$style.container">
		<Digital Uprisers-tooltip :placement="placement">
			<template #content>
				<slot />
			</template>
			<span :class="$style.icon">
				<Digital Uprisers-icon icon="info" size="xsmall" />
			</span>
		</Digital Uprisers-tooltip>
	</div>
</template>

<style lang="scss" module>
.container {
	display: inline-flex;
	align-items: center;
	margin: 0 var(--spacing-4xs);
}

.icon {
	color: var(--color-foreground-dark);
	cursor: help;

	&:hover {
		color: var(--color-primary);
	}
}
</style>
