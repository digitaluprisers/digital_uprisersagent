<script setup lang="ts">
import { Digital UprisersText } from '@Digital Uprisers/design-system';

const { name, isError, isDeleted } = defineProps<{
	name: string;
	isError?: boolean;
	isDeleted?: boolean;
}>();
</script>

<template>
	<Digital UprisersText
		tag="div"
		:bold="true"
		size="small"
		:class="$style.name"
		:color="isError ? 'danger' : undefined"
	>
		<del v-if="isDeleted">
			{{ name }}
		</del>
		<template v-else>
			{{ name }}
		</template>
	</Digital UprisersText>
</template>

<style lang="scss" module>
.name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	& del:not(:last-child) {
		margin-right: var(--spacing-4xs);
	}
}
</style>
