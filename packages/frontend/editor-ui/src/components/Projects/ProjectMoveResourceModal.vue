<script lang="ts" setup>
import Modal from '@/components/Modal.vue';
import ProjectMoveResourceModalCredentialsList from '@/components/Projects/ProjectMoveResourceModalCredentialsList.vue';
import ProjectMoveSuccessToastMessage from '@/components/Projects/ProjectMoveSuccessToastMessage.vue';
import { useTelemetry } from '@/composables/useTelemetry';
import { useToast } from '@/composables/useToast';
import { VIEWS } from '@/constants';
import type { ICredentialsResponse, IUsedCredential, IWorkflowDb } from '@/Interface';
import { getResourcePermissions } from '@Digital Uprisers/permissions';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useProjectsStore } from '@/stores/projects.store';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { ProjectTypes } from '@/types/projects.types';
import {
	getTruncatedProjectName,
	MAX_NAME_LENGTH,
	ResourceType,
	splitName,
} from '@/utils/projects.utils';
import { useI18n } from '@Digital Uprisers/i18n';
import type { EventBus } from '@Digital Uprisers/utils/event-bus';
import { sortByProperty } from '@Digital Uprisers/utils/sort/sortByProperty';
import { truncate } from '@Digital Uprisers/utils/string/truncate';
import { computed, h, onMounted, ref } from 'vue';

const props = defineProps<{
	modalName: string;
	data: {
		resource: IWorkflowDb | ICredentialsResponse;
		resourceType: ResourceType;
		resourceTypeLabel: string;
		eventBus?: EventBus;
	};
}>();

const i18n = useI18n();
const uiStore = useUIStore();
const toast = useToast();
const projectsStore = useProjectsStore();
const workflowsStore = useWorkflowsStore();
const credentialsStore = useCredentialsStore();
const telemetry = useTelemetry();

const filter = ref('');
const projectId = ref<string | null>(null);
const shareUsedCredentials = ref(false);
const usedCredentials = ref<IUsedCredential[]>([]);
const allCredentials = ref<ICredentialsResponse[]>([]);
const shareableCredentials = computed(() =>
	allCredentials.value.filter(
		(credential) =>
			getResourcePermissions(credential.scopes).credential.share &&
			usedCredentials.value.find((uc) => uc.id === credential.id),
	),
);
const unShareableCredentials = computed(() =>
	usedCredentials.value.reduce(
		(acc, uc) => {
			const credential = credentialsStore.getCredentialById(uc.id);
			const credentialPermissions = getResourcePermissions(credential?.scopes).credential;
			if (!credentialPermissions.share) {
				if (credentialPermissions.read) {
					acc.push(credential);
				} else {
					acc.push(uc);
				}
			}
			return acc;
		},
		[] as Array<IUsedCredential | ICredentialsResponse>,
	),
);
const homeProjectName = computed(
	() => processProjectName(props.data.resource.homeProject?.name ?? '') ?? '',
);
const availableProjects = computed(() =>
	sortByProperty(
		'name',
		projectsStore.availableProjects.filter(
			(p) =>
				p.id !== props.data.resource.homeProject?.id &&
				(!p.scopes || getResourcePermissions(p.scopes)[props.data.resourceType].create),
		),
	),
);
const filteredProjects = computed(() =>
	availableProjects.value.filter((p) => p.name?.toLowerCase().includes(filter.value.toLowerCase())),
);
const selectedProject = computed(() =>
	availableProjects.value.find((p) => p.id === projectId.value),
);
const isResourceInTeamProject = computed(() => isHomeProjectTeam(props.data.resource));
const isResourceWorkflow = computed(() => props.data.resourceType === ResourceType.Workflow);
const targetProjectName = computed(() => {
	return getTruncatedProjectName(selectedProject.value?.name);
});
const resourceName = computed(() => truncate(props.data.resource.name, MAX_NAME_LENGTH));

const isHomeProjectTeam = (resource: IWorkflowDb | ICredentialsResponse) =>
	resource.homeProject?.type === ProjectTypes.Team;

const processProjectName = (projectName: string) => {
	const { name, email } = splitName(projectName);
	return name ?? email;
};

const updateProject = (value: string) => {
	projectId.value = value;
};

const closeModal = () => {
	uiStore.closeModal(props.modalName);
};

const setFilter = (query: string) => {
	filter.value = query;
};

const moveResource = async () => {
	if (!selectedProject.value) return;
	try {
		await projectsStore.moveResourceToProject(
			props.data.resourceType,
			props.data.resource.id,
			selectedProject.value.id,
			undefined,
			shareUsedCredentials.value ? shareableCredentials.value.map((c) => c.id) : undefined,
		);
		closeModal();
		telemetry.track(`User successfully moved ${props.data.resourceType}`, {
			[`${props.data.resourceType}_id`]: props.data.resource.id,
			project_from_type: projectsStore.currentProject?.type ?? projectsStore.personalProject?.type,
		});
		toast.showToast({
			title: i18n.baseText('projects.move.resource.success.title', {
				interpolate: {
					resourceTypeLabel: props.data.resourceTypeLabel,
					resourceName: resourceName.value,
					targetProjectName: targetProjectName.value,
				},
			}),
			message: h(ProjectMoveSuccessToastMessage, {
				routeName: isResourceWorkflow.value ? VIEWS.PROJECTS_WORKFLOWS : VIEWS.PROJECTS_CREDENTIALS,
				resourceType: props.data.resourceType,
				targetProject: selectedProject.value,
				isShareCredentialsChecked: shareUsedCredentials.value,
				areAllUsedCredentialsShareable:
					shareableCredentials.value.length === usedCredentials.value.length,
			}),
			type: 'success',
			duration: 8000,
		});
		if (props.data.eventBus) {
			props.data.eventBus.emit('resource-moved', {
				resourceId: props.data.resource.id,
				resourceType: props.data.resourceType,
				targetProjectId: selectedProject.value.id,
			});
		}
	} catch (error) {
		toast.showError(
			error.message,
			i18n.baseText('projects.move.resource.error.title', {
				interpolate: {
					resourceTypeLabel: props.data.resourceTypeLabel,
					resourceName: resourceName.value,
				},
			}),
		);
	}
};

onMounted(async () => {
	telemetry.track(`User clicked to move a ${props.data.resourceType}`, {
		[`${props.data.resourceType}_id`]: props.data.resource.id,
		project_from_type: projectsStore.currentProject?.type ?? projectsStore.personalProject?.type,
	});

	await projectsStore.getAvailableProjects();

	if (isResourceWorkflow.value) {
		const [workflow, credentials] = await Promise.all([
			workflowsStore.fetchWorkflow(props.data.resource.id),
			credentialsStore.fetchAllCredentials(),
		]);

		usedCredentials.value = workflow?.usedCredentials ?? [];
		allCredentials.value = credentials ?? [];
	}
});
</script>
<template>
	<Modal width="500px" :name="props.modalName" data-test-id="project-move-resource-modal">
		<template #header>
			<Digital UprisersHeading tag="h2" size="xlarge" class="mb-m pr-s">
				{{
					i18n.baseText('projects.move.resource.modal.title', {
						interpolate: { resourceTypeLabel: props.data.resourceTypeLabel },
					})
				}}
			</Digital UprisersHeading>
			<Digital UprisersText>
				<i18n-t keypath="projects.move.resource.modal.message">
					<template #resourceName
						><strong>{{ resourceName }}</strong></template
					>
					<template v-if="isResourceInTeamProject" #inTeamProject>
						<i18n-t keypath="projects.move.resource.modal.message.team">
							<template #resourceHomeProjectName
								><strong>{{ homeProjectName }}</strong></template
							>
						</i18n-t>
					</template>
					<template v-else #inPersonalProject>
						<i18n-t keypath="projects.move.resource.modal.message.personal">
							<template #resourceHomeProjectName
								><strong>{{ homeProjectName }}</strong></template
							>
						</i18n-t>
					</template>
				</i18n-t>
			</Digital UprisersText>
		</template>
		<template #content>
			<div v-if="availableProjects.length">
				<Digital UprisersSelect
					class="mr-2xs mb-xs"
					:model-value="projectId"
					:filterable="true"
					:filter-method="setFilter"
					:placeholder="i18n.baseText('projects.move.resource.modal.selectPlaceholder')"
					data-test-id="project-move-resource-modal-select"
					@update:model-value="updateProject"
				>
					<template #prefix>
						<Digital UprisersIcon icon="search" />
					</template>
					<Digital UprisersOption
						v-for="p in filteredProjects"
						:key="p.id"
						:value="p.id"
						:label="p.name ?? ''"
					></Digital UprisersOption>
				</Digital UprisersSelect>
				<Digital UprisersText>
					<i18n-t keypath="projects.move.resource.modal.message.sharingNote">
						<template #note
							><strong>{{
								i18n.baseText('projects.move.resource.modal.message.note')
							}}</strong></template
						>
						<template #resourceTypeLabel>{{ props.data.resourceTypeLabel }}</template>
					</i18n-t>
					<span
						v-if="props.data.resource.sharedWithProjects?.length ?? 0 > 0"
						:class="$style.textBlock"
					>
						{{
							i18n.baseText('projects.move.resource.modal.message.sharingInfo', {
								adjustToNumber: props.data.resource.sharedWithProjects?.length,
								interpolate: {
									count: props.data.resource.sharedWithProjects?.length ?? 0,
								},
							})
						}}</span
					>
					<Digital UprisersCheckbox
						v-if="shareableCredentials.length"
						v-model="shareUsedCredentials"
						:class="$style.textBlock"
						data-test-id="project-move-resource-modal-checkbox-all"
					>
						<i18n-t keypath="projects.move.resource.modal.message.usedCredentials">
							<template #usedCredentials>
								<Digital UprisersTooltip placement="top">
									<span :class="$style.tooltipText">
										{{
											i18n.baseText('projects.move.resource.modal.message.usedCredentials.number', {
												adjustToNumber: shareableCredentials.length,
												interpolate: { count: shareableCredentials.length },
											})
										}}
									</span>
									<template #content>
										<ProjectMoveResourceModalCredentialsList
											:current-project-id="projectsStore.currentProjectId"
											:credentials="shareableCredentials"
										/>
									</template>
								</Digital UprisersTooltip>
							</template>
						</i18n-t>
					</Digital UprisersCheckbox>
					<span v-if="unShareableCredentials.length" :class="$style.textBlock">
						<i18n-t keypath="projects.move.resource.modal.message.unAccessibleCredentials.note">
							<template #credentials>
								<Digital UprisersTooltip placement="top">
									<span :class="$style.tooltipText">{{
										i18n.baseText('projects.move.resource.modal.message.unAccessibleCredentials')
									}}</span>
									<template #content>
										<ProjectMoveResourceModalCredentialsList
											:current-project-id="projectsStore.currentProjectId"
											:credentials="unShareableCredentials"
										/>
									</template>
								</Digital UprisersTooltip>
							</template>
						</i18n-t>
					</span>
				</Digital UprisersText>
			</div>
			<Digital UprisersText v-else>{{
				i18n.baseText('projects.move.resource.modal.message.noProjects', {
					interpolate: { resourceTypeLabel: props.data.resourceTypeLabel },
				})
			}}</Digital UprisersText>
		</template>
		<template #footer>
			<div :class="$style.buttons">
				<Digital UprisersButton type="secondary" text class="mr-2xs" @click="closeModal">
					{{ i18n.baseText('generic.cancel') }}
				</Digital UprisersButton>
				<Digital UprisersButton
					:disabled="!projectId"
					type="primary"
					data-test-id="project-move-resource-modal-button"
					@click="moveResource"
				>
					{{
						i18n.baseText('projects.move.resource.modal.button', {
							interpolate: { resourceTypeLabel: props.data.resourceTypeLabel },
						})
					}}
				</Digital UprisersButton>
			</div>
		</template>
	</Modal>
</template>

<style lang="scss" module>
.buttons {
	display: flex;
	justify-content: flex-end;
}

.textBlock {
	display: block;
	margin-top: var(--spacing-s);
}

.tooltipText {
	text-decoration: underline;
}
</style>
