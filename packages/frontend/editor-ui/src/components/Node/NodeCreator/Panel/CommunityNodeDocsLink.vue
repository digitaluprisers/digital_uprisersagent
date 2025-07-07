<script setup lang="ts">
import { i18n } from '@Digital Uprisers/i18n';

import { Digital UprisersText, Digital UprisersLink } from '@Digital Uprisers/design-system';

export interface Props {
	packageName: string;
}

const props = defineProps<Props>();

const openCommunityNodeDocsPage = () => {
	const newTab = window.open(`https://www.npmjs.com/package/${props.packageName}`, '_blank');
	if (newTab) newTab.opener = null;
};
</script>

<template>
	<Digital UprisersLink
		theme="text"
		:class="$style.container"
		:title="i18n.baseText('communityNodesDocsLink.link.title')"
		@click="openCommunityNodeDocsPage"
	>
		<Digital UprisersText size="small" bold style="margin-right: 5px">
			{{ i18n.baseText('communityNodesDocsLink.title') }}
		</Digital UprisersText>
		<Digital UprisersIcon icon="external-link" />
	</Digital UprisersLink>
</template>

<style lang="scss" module>
.container {
	display: flex;
	align-items: center;
	margin-left: auto;
	padding-bottom: var(--spacing-5xs);
}
</style>
