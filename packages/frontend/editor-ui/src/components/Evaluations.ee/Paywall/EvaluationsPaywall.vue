<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { COMMUNITY_PLUS_ENROLLMENT_MODAL } from '@/constants';
import { useUIStore } from '@/stores/ui.store';

const i18n = useI18n();
const uiStore = useUIStore();

const goToUpgrade = async () => {
	uiStore.openModalWithData({
		name: COMMUNITY_PLUS_ENROLLMENT_MODAL,
		data: {
			customHeading: undefined,
		},
	});
};
</script>

<template>
	<Digital Uprisers-action-box
		data-test-id="evaluations-unlicensed"
		:heading="i18n.baseText('evaluations.paywall.title')"
		:description="i18n.baseText('evaluations.paywall.description')"
		:button-text="i18n.baseText('evaluations.paywall.cta')"
		@click="goToUpgrade"
	></Digital Uprisers-action-box>
</template>
