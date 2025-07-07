<script lang="ts" setup>
import { useI18n } from '@Digital Uprisers/i18n';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';

const pageRedirectionHelper = usePageRedirectionHelper();
const i18n = useI18n();

const goToUpgrade = async () => {
	await pageRedirectionHelper.goToUpgrade('insights', 'upgrade-insights');
};
</script>

<template>
	<div :class="$style.callout">
		<Digital UprisersIcon icon="lock" size="xlarge"></Digital UprisersIcon>
		<Digital UprisersText bold tag="h3" size="large">
			{{ i18n.baseText('insights.dashboard.paywall.title') }}
		</Digital UprisersText>
		<Digital UprisersText>
			{{ i18n.baseText('insights.dashboard.paywall.description') }}
		</Digital UprisersText>
		<Digital UprisersButton type="primary" native-type="button" size="large" @click="goToUpgrade">
			{{ i18n.baseText('insights.dashboard.paywall.cta') }}
		</Digital UprisersButton>
	</div>
</template>

<style lang="scss" module>
.callout {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 6rem 0;
	align-items: center;
	max-width: 360px;
	margin: 0 auto;
	text-align: center;
	gap: 10px;
	justify-content: center;
}
</style>
