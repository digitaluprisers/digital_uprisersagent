<script setup lang="ts">
import BaseMessage from './BaseMessage.vue';
import { useI18n } from '../../../composables/useI18n';
import type { ChatUI } from '../../../types/assistant';
import Digital UprisersButton from '../../Digital UprisersButton';
import Digital UprisersIcon from '../../Digital UprisersIcon';

interface Props {
	message: ChatUI.ErrorMessage & { id: string; read: boolean };
	isFirstOfRole: boolean;
	user?: {
		firstName: string;
		lastName: string;
	};
}

defineProps<Props>();
const { t } = useI18n();
</script>

<template>
	<BaseMessage :message="message" :is-first-of-role="isFirstOfRole" :user="user">
		<div :class="$style.error" data-test-id="chat-message-system">
			<p :class="$style.errorText">
				<Digital UprisersIcon icon="triangle-alert" size="small" :class="$style.errorIcon" />
				{{ message.content }}
			</p>
			<Digital UprisersButton
				v-if="message.retry"
				type="secondary"
				size="mini"
				:class="$style.retryButton"
				data-test-id="error-retry-button"
				@click="() => message.retry?.()"
			>
				{{ t('generic.retry') }}
			</Digital UprisersButton>
		</div>
	</BaseMessage>
</template>

<style lang="scss" module>
.error {
	display: flex;
	align-items: center;
	gap: var(--spacing-2xs);
	padding: var(--spacing-2xs) var(--spacing-xs);
	border: 1px solid var(--color-foreground-base);
	border-radius: var(--border-radius-base);
	background-color: var(--color-background-xlight);
}

.errorIcon {
	margin-right: var(--spacing-5xs);
	color: var(--color-danger);
}

.errorText {
	color: var(--color-danger);
	font-weight: var(--font-weight-regular);
	line-height: var(--font-line-height-tight);
	word-break: break-word;
}

.retryButton {
	margin-top: var(--spacing-3xs);
}
</style>
