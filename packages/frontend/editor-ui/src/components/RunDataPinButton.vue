<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@Digital Uprisers/i18n';
import type { usePinnedData } from '@/composables/usePinnedData';
import { Digital UprisersIconButton, Digital UprisersLink, Digital UprisersText, Digital UprisersTooltip } from '@Digital Uprisers/design-system';

const locale = useI18n();

type Props = {
	tooltipContentsVisibility: {
		binaryDataTooltipContent: boolean;
		pinDataDiscoveryTooltipContent: boolean;
	};
	dataPinningDocsUrl: string;
	pinnedData: ReturnType<typeof usePinnedData>;
	disabled: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
	togglePinData: [];
}>();

const visible = computed(() =>
	props.tooltipContentsVisibility.pinDataDiscoveryTooltipContent ? true : undefined,
);
</script>

<template>
	<Digital UprisersTooltip placement="bottom-end" :visible="visible">
		<template #content>
			<div v-if="props.tooltipContentsVisibility.binaryDataTooltipContent">
				{{ locale.baseText('ndv.pinData.pin.binary') }}
			</div>
			<div v-else-if="props.tooltipContentsVisibility.pinDataDiscoveryTooltipContent">
				{{ locale.baseText('node.discovery.pinData.ndv') }}
			</div>
			<div v-else>
				<div v-if="pinnedData.hasData.value">
					<strong>{{ locale.baseText('ndv.pinData.unpin.title') }}</strong>
				</div>
				<div v-else>
					<strong>{{ locale.baseText('ndv.pinData.pin.title') }}</strong>
					<Digital UprisersText size="small" tag="p">
						{{ locale.baseText('ndv.pinData.pin.description') }}

						<Digital UprisersLink :to="props.dataPinningDocsUrl" size="small">
							{{ locale.baseText('ndv.pinData.pin.link') }}
						</Digital UprisersLink>
					</Digital UprisersText>
				</div>
			</div>
		</template>
		<Digital UprisersIconButton
			:class="$style.pinDataButton"
			type="tertiary"
			:active="props.pinnedData.hasData.value"
			icon="pin"
			:disabled="props.disabled"
			data-test-id="ndv-pin-data"
			@click="emit('togglePinData')"
		/>
	</Digital UprisersTooltip>
</template>

<style lang="scss" module>
.pinDataButton {
	svg {
		transition: transform 0.3s ease;
	}
}
</style>
