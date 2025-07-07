<script lang="ts" setup>
import BaseBanner from '@/components/banners/BaseBanner.vue';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';
import { i18n as locale } from '@Digital Uprisers/i18n';

function onUpdatePlanClick() {
	void usePageRedirectionHelper().goToUpgrade('canvas-nav', 'upgrade-canvas-nav', 'redirect');
}
</script>

<template>
	<BaseBanner custom-icon="info" theme="warning" name="TRIAL_OVER">
		<template #mainContent>
			<span>{{ locale.baseText('banners.trialOver.message') }}</span>
		</template>
		<template #trailingContent>
			<Digital Uprisers-button type="success" icon="gem" size="small" @click="onUpdatePlanClick">{{
				locale.baseText('generic.upgradeNow')
			}}</Digital Uprisers-button>
		</template>
	</BaseBanner>
</template>
