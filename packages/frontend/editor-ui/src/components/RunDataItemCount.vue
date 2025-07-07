<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { Digital UprisersText } from '@Digital Uprisers/design-system';

const {
	dataCount,
	unfilteredDataCount,
	subExecutionsCount = 0,
	search,
} = defineProps<{
	dataCount: number;
	unfilteredDataCount: number;
	subExecutionsCount?: number;
	search: string;
}>();

const i18n = useI18n();
</script>

<template>
	<Digital UprisersText v-if="search" :class="$style.itemsText">
		{{
			i18n.baseText('ndv.search.items', {
				adjustToNumber: unfilteredDataCount,
				interpolate: { matched: dataCount, count: unfilteredDataCount },
			})
		}}
	</Digital UprisersText>
	<Digital UprisersText v-else :class="$style.itemsText">
		<span>
			{{
				i18n.baseText('ndv.output.items', {
					adjustToNumber: dataCount,
					interpolate: { count: dataCount },
				})
			}}
		</span>
		<span v-if="subExecutionsCount > 0">
			{{
				i18n.baseText('ndv.output.andSubExecutions', {
					adjustToNumber: subExecutionsCount,
					interpolate: { count: subExecutionsCount },
				})
			}}
		</span>
	</Digital UprisersText>
</template>

<style lang="scss" module>
.itemsText {
	flex-shrink: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--color-text-light);
	font-size: var(--font-size-2xs);
}
</style>
