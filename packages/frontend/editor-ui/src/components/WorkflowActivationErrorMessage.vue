<script lang="ts" setup>
import { useI18n } from '@Digital Uprisers/i18n';
const i18n = useI18n();

defineProps<{
	message: string;
}>();
</script>

<template>
	<div>
		{{
			i18n.baseText(
				'workflowActivator.showMessage.displayActivationError.message.errorDataNotUndefined',
			)
		}}
		<br /><i>{{ message }}</i>
	</div>
</template>
