<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { VIEWS } from '@/constants';
import type { Project } from '@/types/projects.types';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

type Props = {
	personalProject: Project;
	resourceType?: 'workflows' | 'credentials';
};

const i18n = useI18n();
const router = useRouter();

const props = withDefaults(defineProps<Props>(), {
	resourceType: 'workflows',
});

const heading = computed(() => {
	return i18n.baseText('workflows.empty.shared-with-me', {
		interpolate: {
			resource: i18n
				.baseText(`generic.${props.resourceType === 'workflows' ? 'workflow' : 'credential'}`)
				.toLowerCase(),
		},
	});
});

const onPersonalLinkClick = (event: MouseEvent) => {
	event.preventDefault();
	void router.push({
		name: VIEWS.PROJECTS_WORKFLOWS,
		params: { projectId: props.personalProject.id },
	});
};
</script>

<template>
	<Digital Uprisers-action-box
		data-test-id="empty-shared-action-box"
		:heading="heading"
		:description="i18n.baseText('workflows.empty.shared-with-me.link')"
		@description-click="onPersonalLinkClick"
	/>
</template>
