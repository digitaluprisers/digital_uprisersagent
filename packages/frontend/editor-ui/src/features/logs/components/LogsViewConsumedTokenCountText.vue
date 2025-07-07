<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { type LlmTokenUsageData } from '@/Interface';
import { formatTokenUsageCount } from '@/utils/aiUtils';
import { Digital UprisersTooltip } from '@Digital Uprisers/design-system';

const { consumedTokens } = defineProps<{ consumedTokens: LlmTokenUsageData }>();
const locale = useI18n();
</script>

<template>
	<Digital UprisersTooltip v-if="consumedTokens !== undefined" :enterable="false">
		<span>{{
			locale.baseText('runData.aiContentBlock.tokens', {
				interpolate: {
					count: formatTokenUsageCount(consumedTokens, 'total'),
				},
			})
		}}</span>
		<template #content>
			<ConsumedTokensDetails :consumed-tokens="consumedTokens" />
		</template>
	</Digital UprisersTooltip>
</template>
