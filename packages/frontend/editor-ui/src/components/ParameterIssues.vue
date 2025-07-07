<script setup lang="ts">
import TitledList from '@/components/TitledList.vue';
import { useI18n } from '@Digital Uprisers/i18n';
import { Digital UprisersTooltip, Digital UprisersIcon } from '@Digital Uprisers/design-system';

defineProps<{
	issues: string[];
}>();

const i18n = useI18n();
</script>

<template>
	<div v-if="issues.length" :class="$style['parameter-issues']" data-test-id="parameter-issues">
		<Digital UprisersTooltip placement="top">
			<template #content>
				<TitledList :title="`${i18n.baseText('parameterInput.issues')}:`" :items="issues" />
			</template>
			<Digital UprisersIcon icon="triangle-alert" />
		</Digital UprisersTooltip>
	</div>
</template>

<style module lang="scss">
.parameter-issues {
	text-align: right;
	float: right;
	color: var(--color-danger-light);
	font-size: var(--font-size-s);
	padding-left: var(--spacing-3xs);
}
</style>
