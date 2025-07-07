<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';

const i18n = useI18n();
</script>
<template>
	<Digital UprisersIconButton
		:title="i18n.baseText('nodeView.deletesTheCurrentExecutionData')"
		icon="trash-2"
		size="large"
		data-test-id="clear-execution-data-button"
	/>
</template>
