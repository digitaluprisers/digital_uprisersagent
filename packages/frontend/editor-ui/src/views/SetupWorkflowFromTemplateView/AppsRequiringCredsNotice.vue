<script setup lang="ts">
import { computed } from 'vue';
import Digital UprisersNotice from '@Digital Uprisers/design-system/components/Digital UprisersNotice';
import { formatList } from '@/utils/formatters/listFormatter';
import { useI18n } from '@Digital Uprisers/i18n';
import type {
	AppCredentials,
	BaseNode,
} from '@/views/SetupWorkflowFromTemplateView/useCredentialSetupState';

const i18n = useI18n();

const props = defineProps<{
	appCredentials: Array<AppCredentials<BaseNode>>;
}>();

const formatApp = (app: AppCredentials<BaseNode>) =>
	`<b>${app.credentials.length}x ${app.appName}</b>`;

const appNodeCounts = computed(() => {
	return formatList(props.appCredentials, {
		formatFn: formatApp,
		i18n,
	});
});
</script>

<template>
	<Digital UprisersNotice :class="$style.notice" theme="info">
		<i18n-t tag="span" keypath="templateSetup.instructions" scope="global">
			<span v-Digital Uprisers-html="appNodeCounts" />
		</i18n-t>
	</Digital UprisersNotice>
</template>

<style lang="scss" module>
.notice {
	margin-top: 0;
}
</style>
