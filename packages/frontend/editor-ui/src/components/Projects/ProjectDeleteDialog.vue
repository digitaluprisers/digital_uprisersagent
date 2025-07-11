<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Project, ProjectListItem, ProjectSharingData } from '@/types/projects.types';
import ProjectSharing from '@/components/Projects/ProjectSharing.vue';
import { useI18n } from '@Digital Uprisers/i18n';

type Props = {
	currentProject: Project | null;
	projects: ProjectListItem[];
	isCurrentProjectEmpty: boolean;
};

const props = defineProps<Props>();
const visible = defineModel<boolean>();
const emit = defineEmits<{
	confirmDelete: [value?: string];
}>();

const locale = useI18n();

const selectedProject = ref<ProjectSharingData | null>(null);
const operation = ref<'transfer' | 'wipe' | null>(null);
const wipeConfirmText = ref('');
const isValid = computed(() => {
	const expectedWipeConfirmation = locale.baseText(
		'projects.settings.delete.question.wipe.placeholder',
	);

	return (
		props.isCurrentProjectEmpty ||
		(operation.value === 'transfer' && !!selectedProject.value) ||
		(operation.value === 'wipe' && wipeConfirmText.value === expectedWipeConfirmation)
	);
});

const onDelete = () => {
	if (!isValid.value) {
		return;
	}

	if (operation.value === 'wipe') {
		selectedProject.value = null;
	}

	emit('confirmDelete', selectedProject.value?.id);
};
</script>
<template>
	<el-dialog
		v-model="visible"
		:title="
			locale.baseText('projects.settings.delete.title', {
				interpolate: { projectName: props.currentProject?.name ?? '' },
			})
		"
		width="500"
	>
		<Digital Uprisers-text v-if="isCurrentProjectEmpty" color="text-base">{{
			locale.baseText('projects.settings.delete.message.empty')
		}}</Digital Uprisers-text>
		<div v-else>
			<Digital Uprisers-text color="text-base">{{
				locale.baseText('projects.settings.delete.message')
			}}</Digital Uprisers-text>
			<div class="pt-l">
				<el-radio
					:model-value="operation"
					label="transfer"
					class="mb-s"
					@update:model-value="operation = 'transfer'"
				>
					<Digital Uprisers-text color="text-dark">{{
						locale.baseText('projects.settings.delete.question.transfer.label')
					}}</Digital Uprisers-text>
				</el-radio>
				<div v-if="operation === 'transfer'" :class="$style.operation">
					<Digital Uprisers-text color="text-dark">{{
						locale.baseText('projects.settings.delete.question.transfer.title')
					}}</Digital Uprisers-text>
					<ProjectSharing
						v-model="selectedProject"
						class="pt-2xs"
						:projects="props.projects"
						:empty-options-text="locale.baseText('projects.sharing.noMatchingProjects')"
					/>
				</div>

				<el-radio
					:model-value="operation"
					label="wipe"
					class="mb-s"
					@update:model-value="operation = 'wipe'"
				>
					<Digital Uprisers-text color="text-dark">{{
						locale.baseText('projects.settings.delete.question.wipe.label')
					}}</Digital Uprisers-text>
				</el-radio>
				<div v-if="operation === 'wipe'" :class="$style.operation">
					<Digital Uprisers-input-label :label="locale.baseText('projects.settings.delete.question.wipe.title')">
						<Digital Uprisers-input
							v-model="wipeConfirmText"
							data-test-id="project-delete-confirm-input"
							:placeholder="locale.baseText('projects.settings.delete.question.wipe.placeholder')"
						/>
					</Digital Uprisers-input-label>
				</div>
			</div>
		</div>
		<template #footer>
			<Digital UprisersButton
				type="danger"
				native-type="button"
				:disabled="!isValid"
				data-test-id="project-settings-delete-confirm-button"
				@click.stop.prevent="onDelete"
				>{{ locale.baseText('projects.settings.danger.deleteProject') }}</Digital UprisersButton
			>
		</template>
	</el-dialog>
</template>

<style lang="scss" module>
.operation {
	padding: 0 0 var(--spacing-l) var(--spacing-l);
}
</style>
