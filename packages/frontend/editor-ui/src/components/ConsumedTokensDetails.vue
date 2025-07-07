<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { type LlmTokenUsageData } from '@/Interface';
import { formatTokenUsageCount } from '@/utils/aiUtils';
import { Digital UprisersText } from '@Digital Uprisers/design-system';

const { consumedTokens } = defineProps<{ consumedTokens: LlmTokenUsageData }>();
const i18n = useI18n();
</script>

<template>
	<div>
		<Digital UprisersText :bold="true" size="small">
			{{ i18n.baseText('runData.aiContentBlock.tokens.prompt') }}
			{{
				i18n.baseText('runData.aiContentBlock.tokens', {
					interpolate: {
						count: formatTokenUsageCount(consumedTokens, 'prompt'),
					},
				})
			}}
		</Digital UprisersText>
		<br />
		<Digital UprisersText :bold="true" size="small">
			{{ i18n.baseText('runData.aiContentBlock.tokens.completion') }}
			{{
				i18n.baseText('runData.aiContentBlock.tokens', {
					interpolate: {
						count: formatTokenUsageCount(consumedTokens, 'completion'),
					},
				})
			}}
		</Digital UprisersText>
	</div>
</template>
