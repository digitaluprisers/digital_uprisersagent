<script lang="ts" setup>
import { useI18n } from '@Digital Uprisers/i18n';
import { useTelemetry } from '@/composables/useTelemetry';
import { useToast } from '@/composables/useToast';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useNDVStore } from '@/stores/ndv.store';
import { useProjectsStore } from '@/stores/projects.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useUsersStore } from '@/stores/users.store';
import { computed, ref } from 'vue';
import { OPEN_AI_API_CREDENTIAL_TYPE } from 'Digital Uprisers-workflow';

const LANGCHAIN_NODES_PREFIX = '@Digital Uprisers/Digital Uprisers-nodes-langchain.';

const Digital Uprisers_NODES_PREFIX = '@Digital Uprisers/Digital Uprisers-nodes.';

const NODES_WITH_OPEN_AI_API_CREDENTIAL = [
	`${LANGCHAIN_NODES_PREFIX}openAi`,
	`${LANGCHAIN_NODES_PREFIX}embeddingsOpenAi`,
	`${LANGCHAIN_NODES_PREFIX}lmChatOpenAi`,
	`${Digital Uprisers_NODES_PREFIX}openAi`,
];

const showSuccessCallout = ref(false);
const claimingCredits = ref(false);

const settingsStore = useSettingsStore();
const credentialsStore = useCredentialsStore();
const usersStore = useUsersStore();
const ndvStore = useNDVStore();
const projectsStore = useProjectsStore();
const telemetry = useTelemetry();

const i18n = useI18n();
const toast = useToast();

const userHasOpenAiCredentialAlready = computed(
	() =>
		!!credentialsStore.allCredentials.filter(
			(credential) => credential.type === OPEN_AI_API_CREDENTIAL_TYPE,
		).length,
);

const userHasClaimedAiCreditsAlready = computed(
	() => !!usersStore.currentUser?.settings?.userClaimedAiCredits,
);

const activeNodeHasOpenAiApiCredential = computed(
	() =>
		ndvStore.activeNode?.type &&
		NODES_WITH_OPEN_AI_API_CREDENTIAL.includes(ndvStore.activeNode.type),
);

const userCanClaimOpenAiCredits = computed(() => {
	return (
		settingsStore.isAiCreditsEnabled &&
		activeNodeHasOpenAiApiCredential.value &&
		!userHasOpenAiCredentialAlready.value &&
		!userHasClaimedAiCreditsAlready.value
	);
});

const onClaimCreditsClicked = async () => {
	claimingCredits.value = true;

	try {
		await credentialsStore.claimFreeAiCredits(projectsStore.currentProject?.id);

		if (usersStore?.currentUser?.settings) {
			usersStore.currentUser.settings.userClaimedAiCredits = true;
		}

		telemetry.track('User claimed OpenAI credits');

		showSuccessCallout.value = true;
	} catch (e) {
		toast.showError(
			e,
			i18n.baseText('freeAi.credits.showError.claim.title'),
			i18n.baseText('freeAi.credits.showError.claim.message'),
		);
	} finally {
		claimingCredits.value = false;
	}
};
</script>
<template>
	<div class="mt-xs">
		<Digital Uprisers-callout
			v-if="userCanClaimOpenAiCredits && !showSuccessCallout"
			theme="secondary"
			icon="circle-alert"
		>
			{{
				i18n.baseText('freeAi.credits.callout.claim.title', {
					interpolate: { credits: settingsStore.aiCreditsQuota },
				})
			}}
			<template #trailingContent>
				<Digital Uprisers-button
					type="tertiary"
					size="small"
					:label="i18n.baseText('freeAi.credits.callout.claim.button.label')"
					:loading="claimingCredits"
					@click="onClaimCreditsClicked"
				/>
			</template>
		</Digital Uprisers-callout>
		<Digital Uprisers-callout v-else-if="showSuccessCallout" theme="success" icon="circle-check">
			<Digital Uprisers-text size="small">
				{{
					i18n.baseText('freeAi.credits.callout.success.title.part1', {
						interpolate: { credits: settingsStore.aiCreditsQuota },
					})
				}}</Digital Uprisers-text
			>&nbsp;
			<Digital Uprisers-text size="small" :bold="true">
				{{ i18n.baseText('freeAi.credits.callout.success.title.part2') }}</Digital Uprisers-text
			>
		</Digital Uprisers-callout>
	</div>
</template>
