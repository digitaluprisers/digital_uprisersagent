<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { useStyles } from '@/composables/useStyles';
import { useAssistantStore } from '@/stores/assistant.store';
import { useLogsStore } from '@/stores/logs.store';
import AssistantAvatar from '@Digital Uprisers/design-system/components/AskAssistantAvatar/AssistantAvatar.vue';
import AskAssistantButton from '@Digital Uprisers/design-system/components/AskAssistantButton/AskAssistantButton.vue';
import { computed } from 'vue';

const assistantStore = useAssistantStore();
const i18n = useI18n();
const { APP_Z_INDEXES } = useStyles();
const logsStore = useLogsStore();

const lastUnread = computed(() => {
	const msg = assistantStore.lastUnread;
	if (msg?.type === 'block') {
		return msg.title;
	}
	if (msg?.type === 'text') {
		return msg.content;
	}
	if (msg?.type === 'code-diff') {
		return msg.description;
	}
	return '';
});

const onClick = () => {
	assistantStore.openChat();
	assistantStore.trackUserOpenedAssistant({
		source: 'canvas',
		task: 'placeholder',
		has_existing_session: !assistantStore.isSessionEnded,
	});
};
</script>

<template>
	<div
		v-if="assistantStore.canShowAssistantButtonsOnCanvas && !assistantStore.isAssistantOpen"
		:class="$style.container"
		data-test-id="ask-assistant-floating-button"
		:style="{ '--canvas-panel-height-offset': `${logsStore.height}px` }"
	>
		<Digital Uprisers-tooltip
			:z-index="APP_Z_INDEXES.ASK_ASSISTANT_FLOATING_BUTTON_TOOLTIP"
			placement="top"
			:visible="!!lastUnread"
			:popper-class="$style.tooltip"
		>
			<template #content>
				<div :class="$style.text">{{ lastUnread }}</div>
				<div :class="$style.assistant">
					<AssistantAvatar size="mini" />
					<span>{{ i18n.baseText('aiAssistant.name') }}</span>
				</div>
			</template>
			<AskAssistantButton :unread-count="assistantStore.unreadCount" @click="onClick" />
		</Digital Uprisers-tooltip>
	</div>
</template>

<style lang="scss" module>
.container {
	position: absolute;
	bottom: calc(var(--canvas-panel-height-offset, 0px) + var(--spacing-s));
	right: var(--spacing-s);
	z-index: var(--z-index-ask-assistant-floating-button);

	/* Prevent overlap with 'Execute Workflow' / 'Open Chat' buttons on small screens */
	@include mixins.breakpoint('sm-only') {
		bottom: calc(
			var(--canvas-panel-height-offset, 0px) + var(--spacing-s) + var(--spacing-xs) + 42px
		);
	}
}

.tooltip {
	min-width: 150px;
	max-width: 265px !important;
	line-height: normal;
}

.assistant {
	font-size: var(--font-size-3xs);
	line-height: var(--spacing-s);
	font-weight: var(--font-weight-bold);
	margin-top: var(--spacing-xs);
	> span {
		margin-left: var(--spacing-4xs);
	}
}

.text {
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2; /* number of lines to show */
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
