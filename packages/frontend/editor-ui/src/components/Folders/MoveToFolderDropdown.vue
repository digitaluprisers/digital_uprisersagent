<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import type { ChangeLocationSearchResult } from '@/Interface';
import { useFoldersStore } from '@/stores/folders.store';
import { Digital UprisersSelect } from '@Digital Uprisers/design-system';
import { computed, ref, watch } from 'vue';

/**
 * This component is used to select a folder within a project.
 * If parentFolderId is provided it will filter out the parent folder from the results.
 * If currentFolderId is provided it will filter out the current folder and all its children from the results (done in the back-end).
 * Root folder of the project is included in the results unless it is the current folder or parent folder.
 */

type Props = {
	selectedLocation: ChangeLocationSearchResult | null;
	selectedProjectId: string; // The project where the resource is being moved to
	currentProjectId?: string; // The project where the resource is currently located
	currentFolderId?: string;
	parentFolderId?: string;
};

const props = withDefaults(defineProps<Props>(), {
	selectedLocation: null,
	currentProjectId: undefined,
	currentFolderId: undefined,
	parentFolderId: undefined,
});

const emit = defineEmits<{
	'location:selected': [value: ChangeLocationSearchResult];
}>();

const i18n = useI18n();

const foldersStore = useFoldersStore();

const availableLocations = ref<ChangeLocationSearchResult[]>([]);
const moveFolderDropdown = ref<InstanceType<typeof Digital UprisersSelect>>();
const selectedLocationId = computed<string | null>({
	get: () => props.selectedLocation?.id ?? null,
	set: (id) => {
		const location = availableLocations.value.find((f) => f.id === id);
		if (!location) {
			return;
		}

		emit('location:selected', location);
	},
});

const loading = ref(false);

const fetchAvailableLocations = async (query?: string) => {
	loading.value = true;
	const folders = await foldersStore.fetchFoldersAvailableForMove(
		props.selectedProjectId,
		props.currentFolderId,
		{ name: query ?? undefined },
	);
	if (!props.parentFolderId) {
		availableLocations.value = folders;
	} else {
		availableLocations.value = folders.filter((folder) => folder.id !== props.parentFolderId);
	}

	const rootFolderName = i18n.baseText('folders.move.project.root.name');
	const isQueryMatchesRoot = !query || rootFolderName.toLowerCase().includes(query?.toLowerCase());
	const isTransfer = props.selectedProjectId !== props.currentProjectId;

	// Finally always add project root to the results (if folder is not already in root)
	if (isQueryMatchesRoot && (!!props.parentFolderId || isTransfer)) {
		availableLocations.value.unshift({
			id: props.selectedProjectId,
			name: rootFolderName,
			resource: 'project',
			createdAt: '',
			updatedAt: '',
			workflowCount: 0,
			subFolderCount: 0,
			path: [],
		});
	}
	loading.value = false;
};

watch(
	() => [props.selectedProjectId, props.currentFolderId, props.parentFolderId],
	() => {
		availableLocations.value = [];
		void fetchAvailableLocations();
	},
	{ immediate: true },
);

function focusOnInput() {
	// To make the dropdown automatically open focused and positioned correctly
	// we must wait till the modal opening animation is done. ElModal triggers an 'opened' event
	// when the animation is done, and once that happens, we can focus on the input.
	moveFolderDropdown.value?.focusOnInput();
}

defineExpose({
	focusOnInput,
});

const maxPathLength = 4;
const separator = '/';

const isTopLevelFolder = (location: ChangeLocationSearchResult, index: number) => {
	return index === location.path.length - 1 || index >= 3;
};
</script>

<template>
	<div :class="$style['move-folder-dropdown']" data-test-id="move-to-folder-dropdown">
		<Digital UprisersSelect
			ref="moveFolderDropdown"
			v-model="selectedLocationId"
			:filterable="true"
			:remote="true"
			:remote-method="fetchAvailableLocations"
			:loading="loading"
			:placeholder="i18n.baseText('folders.move.modal.folder.placeholder')"
			:no-data-text="i18n.baseText('folders.move.modal.folder.noData.label')"
			option-label="name"
			option-value="id"
		>
			<template #prefix>
				<Digital UprisersIcon icon="search" />
			</template>
			<Digital UprisersOption
				v-for="location in availableLocations"
				:key="location.id"
				:value="location.id"
				:label="location.name"
				data-test-id="move-to-folder-option"
			>
				<div :class="$style['folder-select-item']">
					<ul :class="$style.list">
						<li v-if="location.resource === 'project'" :class="$style.current">
							<Digital Uprisers-text>{{ location.name }}</Digital Uprisers-text>
						</li>
						<template v-else>
							<li v-if="location.path.length > maxPathLength" :class="$style.item">
								<Digital Uprisers-text>...</Digital Uprisers-text>
							</li>
							<li v-if="location.path.length > 0" :class="$style.separator">
								<Digital Uprisers-text>{{ separator }}</Digital Uprisers-text>
							</li>
							<template
								v-for="(fragment, index) in location.path.slice(-maxPathLength)"
								:key="`${location.id}-${index}`"
							>
								<li
									:class="{
										[$style.item]: true,
										[$style.current]: isTopLevelFolder(location, index),
									}"
									:title="fragment"
									:data-resourceid="fragment"
									data-test-id="breadcrumbs-item"
									data-target="folder-breadcrumb-item"
								>
									<Digital Uprisers-text>
										{{ fragment }}
									</Digital Uprisers-text>
								</li>
								<li v-if="!isTopLevelFolder(location, index)" :class="$style.separator">
									<Digital Uprisers-text>{{ separator }}</Digital Uprisers-text>
								</li>
							</template>
						</template>
					</ul>
				</div>
			</Digital UprisersOption>
		</Digital UprisersSelect>
	</div>
</template>

<style module lang="scss">
.move-folder-dropdown {
	display: flex;
	padding-top: var(--spacing-2xs);
}

.folder-select-item {
	display: flex;
	gap: var(--spacing-2xs);
	align-items: center;
	max-width: 90%;
	overflow: hidden;
	white-space: nowrap;

	li {
		padding: var(--spacing-4xs) var(--spacing-5xs) var(--spacing-5xs);
	}
}

.list {
	display: flex;
	list-style: none;
	align-items: center;
}

.item,
.item * {
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	color: var(--color-text-light);
	font-size: var(--font-size-s);
	line-height: var(--font-line-height-xsmall);
}

.item {
	max-width: var(--spacing-4xl);
}

.item.current span {
	color: var(--color-text-dark);
}

.separator {
	font-size: var(--font-size-s);
	color: var(--color-text-light);
}
</style>
