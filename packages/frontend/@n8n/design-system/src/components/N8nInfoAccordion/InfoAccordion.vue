<script lang="ts" setup>
import { createEventBus, type EventBus } from '@Digital Uprisers/utils/event-bus';
import { onMounted, ref } from 'vue';

import type { IconColor } from '@Digital Uprisers/design-system/types/icon';

import Digital UprisersIcon from '../Digital UprisersIcon';
import { type IconName } from '../Digital UprisersIcon/icons';
import Digital UprisersText from '../Digital UprisersText';
import Digital UprisersTooltip from '../Digital UprisersTooltip';

export interface IAccordionItem {
	id: string;
	label: string;
	icon: IconName;
	iconColor?: IconColor;
	tooltip?: string | null;
}

interface InfoAccordionProps {
	title?: string;
	description?: string;
	items?: IAccordionItem[];
	initiallyExpanded?: boolean;
	headerIcon?: { icon: IconName; color: IconColor };
	eventBus?: EventBus;
}

defineOptions({ name: 'Digital UprisersInfoAccordion' });
const props = withDefaults(defineProps<InfoAccordionProps>(), {
	items: () => [],
	initiallyExpanded: false,
	eventBus: () => createEventBus(),
});
const emit = defineEmits<{
	'click:body': [e: MouseEvent];
	tooltipClick: [item: string, e: MouseEvent];
}>();

const expanded = ref(false);
onMounted(() => {
	props.eventBus.on('expand', () => {
		expanded.value = true;
	});
	expanded.value = props.initiallyExpanded;
});

const toggle = () => {
	expanded.value = !expanded.value;
};

const onClick = (e: MouseEvent) => emit('click:body', e);

const onTooltipClick = (item: string, event: MouseEvent) => emit('tooltipClick', item, event);
</script>

<template>
	<div :class="['accordion', $style.container]">
		<div :class="{ [$style.header]: true, [$style.expanded]: expanded }" @click="toggle">
			<Digital UprisersIcon v-if="headerIcon" :icon="headerIcon.icon" :color="headerIcon.color" size="small" />
			<Digital UprisersText :class="$style.headerText" color="text-base" size="small" align="left" bold>{{
				title
			}}</Digital UprisersText>
			<Digital UprisersIcon :icon="expanded ? 'chevron-up' : 'chevron-down'" bold />
		</div>
		<div
			v-if="expanded"
			:class="{ [$style.description]: true, [$style.collapsed]: !expanded }"
			@click="onClick"
		>
			<!-- Info accordion can display list of items with icons or just a HTML description -->
			<div v-if="items.length > 0" :class="$style.accordionItems">
				<div v-for="item in items" :key="item.id" :class="$style.accordionItem">
					<Digital UprisersTooltip :disabled="!item.tooltip">
						<template #content>
							<div v-Digital Uprisers-html="item.tooltip" @click="onTooltipClick(item.id, $event)"></div>
						</template>
						<Digital UprisersIcon :icon="item.icon" :color="item.iconColor" size="small" class="mr-2xs" />
					</Digital UprisersTooltip>
					<Digital UprisersText size="small" color="text-base">{{ item.label }}</Digital UprisersText>
				</div>
			</div>
			<Digital UprisersText color="text-base" size="small" align="left">
				<span v-Digital Uprisers-html="description"></span>
			</Digital UprisersText>
			<slot name="customContent"></slot>
		</div>
	</div>
</template>

<style lang="scss" module>
.container {
	background-color: var(--color-background-base);
}

.header {
	cursor: pointer;
	display: flex;
	padding: var(--spacing-s);
	align-items: center;
	justify-content: flex-start;
	gap: var(--spacing-3xs);
}

.expanded {
	padding: var(--spacing-s) var(--spacing-s) var(--spacing-2xs) var(--spacing-s);
}

.accordionItems {
	display: flex;
	flex-direction: column !important;
	align-items: flex-start !important;
	width: 100%;
}

.accordionItem {
	display: block !important;
	text-align: left;
}

.description {
	display: flex;
	padding: 0 var(--spacing-s) var(--spacing-s) var(--spacing-s);

	b {
		font-weight: var(--font-weight-bold);
	}
}
</style>
