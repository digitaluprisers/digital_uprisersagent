<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useViewStacks } from '../composables/useViewStacks';
import { useUsersStore } from '@/stores/users.store';
import { i18n } from '@Digital Uprisers/i18n';
import { useNodeTypesStore } from '@/stores/nodeTypes.store';
import { useCommunityNodesStore } from '@/stores/communityNodes.store';
import { captureException } from '@sentry/vue';
import { Digital UprisersText, Digital UprisersTooltip, Digital UprisersIcon } from '@Digital Uprisers/design-system';
import ShieldIcon from 'virtual:icons/fa-solid/shield-alt';

const { activeViewStack } = useViewStacks();

const { communityNodeDetails } = activeViewStack;

interface DownloadData {
	downloads: Array<{ downloads: number }>;
}

const publisherName = ref<string | undefined>(undefined);
const downloads = ref<string | null>(null);
const verified = ref(false);
const official = ref(false);
const communityNodesStore = useCommunityNodesStore();
const nodeTypesStore = useNodeTypesStore();

const isOwner = computed(() => useUsersStore().isInstanceOwner);

const ownerEmailList = computed(() =>
	useUsersStore()
		.allUsers.filter((user) => user.role?.includes('owner'))
		.map((user) => user.email),
);

const formatNumber = (number: number) => {
	if (!number) return null;
	return new Intl.NumberFormat('en-US').format(number);
};

async function fetchPackageInfo(packageName: string) {
	const communityNodeAttributes = await nodeTypesStore.getCommunityNodeAttributes(
		activeViewStack.communityNodeDetails?.key || '',
	);

	if (communityNodeAttributes) {
		publisherName.value = communityNodeAttributes.companyName ?? communityNodeAttributes.authorName;
		downloads.value = formatNumber(communityNodeAttributes.numberOfDownloads);
		official.value = communityNodeAttributes.isOfficialNode;
		const packageInfo = communityNodesStore.getInstalledPackages.find(
			(p) => p.packageName === communityNodeAttributes.packageName,
		);
		if (!packageInfo) {
			verified.value = true;
		} else {
			verified.value = packageInfo.installedVersion === communityNodeAttributes.npmVersion;
		}

		return;
	}

	const url = `https://registry.npmjs.org/${packageName}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			captureException(new Error('Could not get metadata for package'), { extra: { packageName } });
			return;
		}

		const data = await response.json();
		const publisher = data.maintainers?.[0]?.name as string | undefined;
		publisherName.value = publisher;

		const today = new Date().toISOString().split('T')[0];
		const downloadsUrl = `https://api.npmjs.org/downloads/range/2022-01-01:${today}/${packageName}`;

		const downloadsResponse = await fetch(downloadsUrl);

		if (!downloadsResponse.ok) {
			captureException(new Error('Could not get downloads for package'), {
				extra: { packageName },
			});
			return;
		}

		const downloadsData: DownloadData = await downloadsResponse.json();
		if (!downloadsData.downloads?.length) return;

		const total = downloadsData.downloads.reduce((sum, day) => sum + day.downloads, 0);

		downloads.value = formatNumber(total);
	} catch (error) {
		captureException(error, { extra: { packageName } });
	}
}

onMounted(async () => {
	if (communityNodeDetails?.packageName) {
		await fetchPackageInfo(communityNodeDetails.packageName);
	}
});
</script>

<template>
	<div :class="$style.container">
		<Digital UprisersText :class="$style.description" color="text-base" size="medium">
			{{ communityNodeDetails?.description }}
		</Digital UprisersText>
		<div :class="$style.separator"></div>
		<div :class="$style.info">
			<Digital UprisersTooltip v-if="verified" placement="top">
				<template #content>{{
					official
						? i18n.baseText('communityNodeInfo.officialApproved')
						: i18n.baseText('communityNodeInfo.approved')
				}}</template>
				<div>
					<ShieldIcon :class="$style.tooltipIcon" />
					<Digital UprisersText color="text-light" size="xsmall" bold data-test-id="verified-tag">
						{{ i18n.baseText('communityNodeInfo.approved.label') }}
					</Digital UprisersText>
				</div>
			</Digital UprisersTooltip>

			<Digital UprisersTooltip v-else placement="top">
				<template #content>{{ i18n.baseText('communityNodeInfo.unverified') }}</template>
				<div>
					<Digital UprisersIcon :class="$style.tooltipIcon" icon="box" />
					<Digital UprisersText color="text-light" size="xsmall" bold>
						{{ i18n.baseText('communityNodeInfo.unverified.label') }}
					</Digital UprisersText>
				</div>
			</Digital UprisersTooltip>

			<div v-if="downloads">
				<Digital UprisersIcon :class="$style.tooltipIcon" icon="hard-drive-download" />
				<Digital UprisersText color="text-light" size="xsmall" bold data-test-id="number-of-downloads">
					{{ i18n.baseText('communityNodeInfo.downloads', { interpolate: { downloads } }) }}
				</Digital UprisersText>
			</div>

			<div v-if="publisherName">
				<Digital UprisersIcon :class="$style.tooltipIcon" icon="user" />
				<Digital UprisersText color="text-light" size="xsmall" bold data-test-id="publisher-name">
					{{ i18n.baseText('communityNodeInfo.publishedBy', { interpolate: { publisherName } }) }}
				</Digital UprisersText>
			</div>
		</div>
		<div v-if="!isOwner && !communityNodeDetails?.installed" :class="$style.contactOwnerHint">
			<Digital UprisersIcon color="text-light" icon="info" size="large" />
			<Digital UprisersText color="text-base" size="medium">
				<div style="padding-bottom: 8px">
					{{ i18n.baseText('communityNodeInfo.contact.admin') }}
				</div>
				<Digital UprisersText v-if="ownerEmailList.length" bold>
					{{ ownerEmailList.join(', ') }}
				</Digital UprisersText>
			</Digital UprisersText>
		</div>
	</div>
</template>

<style lang="scss" module>
.container {
	width: 100%;
	padding: var(--spacing-s);
	padding-top: 0;
	margin-top: 0;
	display: flex;
	flex-direction: column;
}

.nodeIcon {
	--node-icon-size: 36px;
	margin-right: var(--spacing-s);
}

.description {
	margin: var(--spacing-m) 0;
}
.separator {
	height: var(--border-width-base);
	background: var(--color-foreground-base);
	margin-bottom: var(--spacing-m);
}
.info {
	display: flex;
	align-items: center;
	justify-content: left;
	gap: var(--spacing-m);
	margin-bottom: var(--spacing-m);
	flex-wrap: wrap;
}
.info div {
	display: flex;
	align-items: center;
	gap: var(--spacing-4xs);
}

.tooltipIcon {
	color: var(--color-text-light);
	font-size: var(--font-size-2xs);
	width: 12px;
}

.contactOwnerHint {
	display: flex;
	align-items: center;
	gap: var(--spacing-s);
	padding: var(--spacing-xs);
	border: var(--border-width-base) solid var(--color-foreground-base);
	border-radius: 0.25em;
}
</style>
