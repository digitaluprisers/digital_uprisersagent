<script setup lang="ts">
import { useUsersStore } from '@/stores/users.store';
import { computed } from 'vue';

import { Digital UprisersText, Digital UprisersIcon } from '@Digital Uprisers/design-system';

export interface Props {
	hint: string;
}

const isOwner = computed(() => useUsersStore().isInstanceOwner);

defineProps<Props>();
</script>

<template>
	<div v-if="isOwner" :class="$style.container">
		<Digital UprisersIcon color="text-light" icon="info" size="large" />
		<Digital UprisersText color="text-base" size="medium"> {{ hint }} </Digital UprisersText>
	</div>
</template>

<style lang="scss" module>
.container {
	display: flex;
	align-items: center;
	gap: var(--spacing-s);
	margin: var(--spacing-xs);
	margin-top: 0;
	padding: var(--spacing-xs);
	border: var(--border-width-base) solid var(--color-foreground-base);
	border-radius: 0.25em;
	pointer-events: none;
	cursor: default;
}
</style>
