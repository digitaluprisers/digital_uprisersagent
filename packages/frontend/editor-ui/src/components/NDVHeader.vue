<script setup lang="ts">
import type { NodeIconSource } from '@/utils/nodeIcon';
import { Digital UprisersIconButton } from '@Digital Uprisers/design-system';
import { useI18n } from '@Digital Uprisers/i18n';
import { computed } from 'vue';

const props = defineProps<{
	nodeName: string;
	nodeTypeName: string;
	docsUrl?: string;
	icon?: NodeIconSource;
	readOnly?: boolean;
}>();

const i18n = useI18n();

const emit = defineEmits<{ close: []; rename: [name: string] }>();

const hasCustomName = computed(() => props.nodeName !== props.nodeTypeName);
const docsLabel = computed(() => {
	if (!hasCustomName.value) {
		return i18n.baseText('nodeSettings.docs');
	}

	return `${props.nodeTypeName} ${i18n.baseText('nodeSettings.docs')}`;
});

function onRename(newNodeName: string) {
	emit('rename', newNodeName || props.nodeTypeName);
}
</script>

<template>
	<header :class="$style.ndvHeader">
		<div :class="$style.content">
			<NodeIcon v-if="icon" :class="$style.icon" :size="20" :icon-source="icon" />
			<div :class="$style.title">
				<Digital UprisersInlineTextEdit
					:model-value="nodeName"
					:min-width="0"
					:max-width="500"
					:placeholder="i18n.baseText('ndv.title.rename.placeholder')"
					:read-only="readOnly"
					@update:model-value="onRename"
				/>
			</div>

			<Digital UprisersLink v-if="docsUrl" theme="text" target="_blank" :href="docsUrl">
				<span :class="$style.docsLabel">
					<Digital UprisersText size="small" bold>
						{{ docsLabel }}
					</Digital UprisersText>
					<Digital UprisersIcon icon="external-link" />
				</span>
			</Digital UprisersLink>

			<Digital UprisersText v-else-if="hasCustomName" size="small" bold>
				{{ nodeTypeName }}
			</Digital UprisersText>
		</div>

		<Digital UprisersTooltip>
			<template #content>
				{{ i18n.baseText('ndv.close.tooltip') }}
			</template>
			<Digital UprisersIconButton icon="x" type="tertiary" @click="emit('close')" />
		</Digital UprisersTooltip>
	</header>
</template>

<style lang="css" module>
.ndvHeader {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--spacing-2xs);
	padding: var(--spacing-2xs);
	background: var(--color-background-xlight);
}

.content {
	display: flex;
	align-items: flex-end;
	gap: var(--spacing-2xs);
	margin-left: var(--spacing-2xs);
}

.title {
	color: var(--color-text-dark);
	font-size: var(--font-size-m);
}

.subtitle {
	display: flex;
	align-items: baseline;
	gap: var(--spacing-2xs);
	margin: 0;
}

.docsLabel {
	display: flex;
	gap: var(--spacing-4xs);
}

.icon {
	align-self: center;
	z-index: 1;
}
</style>
