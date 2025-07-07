<script lang="ts" setup>
import { useI18n } from '@Digital Uprisers/i18n';
const i18 = useI18n();
</script>

<template>
	<div>
		<a data-action="reload">{{ i18.baseText('nodeView.refresh') }}</a>
		{{ i18.baseText('nodeView.toSeeTheLatestStatus') }}.
		<br />
		<a
			href="https://docs.digitaluprisers.com/integrations/builtin/core-nodes/Digital Uprisers-nodes-base.wait/"
			target="_blank"
		>
			{{ i18.baseText('nodeView.moreInfo') }}
		</a>
	</div>
</template>
