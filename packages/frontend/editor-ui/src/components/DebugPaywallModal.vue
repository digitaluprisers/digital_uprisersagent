<script lang="ts" setup>
import Modal from '@/components/Modal.vue';
import { useI18n } from '@Digital Uprisers/i18n';

const props = defineProps<{
	modalName: string;
	data: { title: string; footerButtonAction: () => void };
}>();

const i18n = useI18n();
</script>

<template>
	<Modal width="500px" :title="props.data.title" :name="props.modalName">
		<template #content>
			<Digital Uprisers-text>
				{{ i18n.baseText('executionsList.debug.paywall.content') }}
				<br />
				<br />
				{{ i18n.baseText('executionsList.debug.paywall.subContent') }}
				<Digital Uprisers-link :to="i18n.baseText('executionsList.debug.paywall.link.url')" new-window>
					{{ i18n.baseText('executionsList.debug.paywall.link.text') }}
				</Digital Uprisers-link>
			</Digital Uprisers-text>
		</template>
		<template #footer>
			<div :class="$style.footer">
				<Digital Uprisers-button @click="props.data.footerButtonAction">
					{{ i18n.baseText('generic.seePlans') }}
				</Digital Uprisers-button>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.footer {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
