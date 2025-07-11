<script setup lang="ts">
import KeyboardShortcutTooltip from '@/components/KeyboardShortcutTooltip.vue';
import { type INodeUi } from '@/Interface';
import { truncateBeforeLast } from '@Digital Uprisers/utils/string/truncate';
import { type ActionDropdownItem, Digital UprisersActionDropdown, Digital UprisersButton, Digital UprisersText } from '@Digital Uprisers/design-system';
import { useI18n } from '@Digital Uprisers/i18n';
import { type INodeTypeDescription } from 'Digital Uprisers-workflow';
import { computed } from 'vue';
import { isChatNode } from '@/utils/aiUtils';

const emit = defineEmits<{
	mouseenter: [event: MouseEvent];
	mouseleave: [event: MouseEvent];
	execute: [];
	selectTriggerNode: [name: string];
}>();

const props = defineProps<{
	selectedTriggerNodeName?: string;
	triggerNodes: INodeUi[];
	waitingForWebhook?: boolean;
	executing?: boolean;
	disabled?: boolean;
	getNodeType: (type: string, typeVersion: number) => INodeTypeDescription | null;
}>();

const i18n = useI18n();

const selectableTriggerNodes = computed(() =>
	props.triggerNodes.filter((node) => !node.disabled && !isChatNode(node)),
);
const label = computed(() => {
	if (!props.executing) {
		return i18n.baseText('nodeView.runButtonText.executeWorkflow');
	}

	if (props.waitingForWebhook) {
		return i18n.baseText('nodeView.runButtonText.waitingForTriggerEvent');
	}

	return i18n.baseText('nodeView.runButtonText.executingWorkflow');
});
const actions = computed(() =>
	props.triggerNodes
		.filter((node) => !isChatNode(node))
		.toSorted((a, b) => {
			const [aX, aY] = a.position;
			const [bX, bY] = b.position;

			return aY === bY ? aX - bX : aY - bY;
		})
		.map<ActionDropdownItem>((node) => ({
			label: truncateBeforeLast(node.name, 25),
			disabled: !!node.disabled || props.executing,
			id: node.name,
			checked: props.selectedTriggerNodeName === node.name,
		})),
);
const isSplitButton = computed(
	() => selectableTriggerNodes.value.length > 1 && props.selectedTriggerNodeName !== undefined,
);

function getNodeTypeByName(name: string): INodeTypeDescription | null {
	const node = props.triggerNodes.find((trigger) => trigger.name === name);

	if (!node) {
		return null;
	}

	return props.getNodeType(node.type, node.typeVersion);
}
</script>

<template>
	<div :class="[$style.component, isSplitButton ? $style.split : '']">
		<KeyboardShortcutTooltip
			:label="label"
			:shortcut="{ metaKey: true, keys: ['↵'] }"
			:disabled="executing"
		>
			<Digital UprisersButton
				:class="$style.button"
				:loading="executing"
				:disabled="disabled"
				size="large"
				icon="flask-conical"
				type="primary"
				data-test-id="execute-workflow-button"
				@mouseenter="$emit('mouseenter', $event)"
				@mouseleave="$emit('mouseleave', $event)"
				@click="emit('execute')"
			>
				<span :class="$style.buttonContent">
					{{ label }}
					<Digital UprisersText v-if="isSplitButton" :class="$style.subText" :bold="false">
						<I18nT keypath="nodeView.runButtonText.from">
							<template #nodeName>
								<Digital UprisersText bold size="mini">
									{{ truncateBeforeLast(props.selectedTriggerNodeName ?? '', 25) }}
								</Digital UprisersText>
							</template>
						</I18nT>
					</Digital UprisersText>
				</span>
			</Digital UprisersButton>
		</KeyboardShortcutTooltip>
		<template v-if="isSplitButton">
			<div role="presentation" :class="$style.divider" />
			<Digital UprisersActionDropdown
				:class="$style.menu"
				:items="actions"
				:disabled="disabled"
				placement="top"
				@select="emit('selectTriggerNode', $event)"
			>
				<template #activator>
					<Digital UprisersButton
						type="primary"
						icon-size="large"
						:disabled="disabled"
						:class="$style.chevron"
						aria-label="Select trigger node"
						icon="chevron-down"
					/>
				</template>
				<template #menuItem="item">
					<div :class="[$style.menuItem, item.disabled ? $style.disabled : '']">
						<NodeIcon :class="$style.menuIcon" :size="16" :node-type="getNodeTypeByName(item.id)" />
						<span>
							<I18nT keypath="nodeView.runButtonText.from">
								<template #nodeName>
									<Digital UprisersText bold size="small">{{ item.label }}</Digital UprisersText>
								</template>
							</I18nT>
						</span>
					</div>
				</template>
			</Digital UprisersActionDropdown>
		</template>
	</div>
</template>

<style lang="scss" module>
.component {
	position: relative;
	display: flex;
	align-items: stretch;
}

.button {
	.split & {
		height: var(--spacing-2xl);

		padding-inline-start: var(--spacing-xs);
		padding-block: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
}

.divider {
	width: 1px;
	background-color: var(--button-font-color, var(--color-button-primary-font));
}

.chevron {
	width: 40px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.menu :global(.el-dropdown) {
	height: 100%;
}

.menuItem {
	display: flex;
	align-items: center;
	gap: var(--spacing-2xs);
}

.menuItem.disabled .menuIcon {
	opacity: 0.2;
}

.buttonContent {
	display: flex;
	flex-direction: column;
	align-items: flex-start !important;
	gap: var(--spacing-5xs);
}

.subText {
	font-size: var(--font-size-2xs);
}
</style>
