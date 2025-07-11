<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';

import { getAppNameFromCredType, isCommunityPackageName } from '@/utils/nodeTypesUtils';
import type {
	ICredentialDataDecryptedObject,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

import type { IUpdateInformation } from '@/Interface';
import AuthTypeSelector from '@/components/CredentialEdit/AuthTypeSelector.vue';
import EnterpriseEdition from '@/components/EnterpriseEdition.ee.vue';
import { useI18n, addCredentialTranslation } from '@Digital Uprisers/i18n';
import { useTelemetry } from '@/composables/useTelemetry';
import {
	BUILTIN_CREDENTIALS_DOCS_URL,
	DOCS_DOMAIN,
	EnterpriseEditionFeature,
	NEW_ASSISTANT_SESSION_MODAL,
} from '@/constants';
import type { PermissionsRecord } from '@Digital Uprisers/permissions';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useNDVStore } from '@/stores/ndv.store';
import { useRootStore } from '@Digital Uprisers/stores/useRootStore';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import Banner from '../Banner.vue';
import CopyInput from '../CopyInput.vue';
import CredentialInputs from './CredentialInputs.vue';
import GoogleAuthButton from './GoogleAuthButton.vue';
import OauthButton from './OauthButton.vue';
import { useAssistantStore } from '@/stores/assistant.store';
import InlineAskAssistantButton from '@Digital Uprisers/design-system/components/InlineAskAssistantButton/InlineAskAssistantButton.vue';

type Props = {
	mode: string;
	credentialType: ICredentialType;
	credentialProperties: INodeProperties[];
	credentialData: ICredentialDataDecryptedObject;
	credentialId?: string;
	credentialPermissions: PermissionsRecord['credential'];
	parentTypes?: string[];
	showValidationWarning?: boolean;
	authError?: string;
	testedSuccessfully?: boolean;
	isOAuthType?: boolean;
	allOAuth2BasePropertiesOverridden?: boolean;
	isOAuthConnected?: boolean;
	isRetesting?: boolean;
	requiredPropertiesFilled?: boolean;
	showAuthTypeSelector?: boolean;
	isManaged?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	parentTypes: () => [],
	credentialId: '',
	authError: '',
	showValidationWarning: false,
	credentialPermissions: () => ({}) as PermissionsRecord['credential'],
});
const emit = defineEmits<{
	update: [value: IUpdateInformation];
	authTypeChanged: [value: string];
	scrollToTop: [];
	retest: [];
	oauth: [];
}>();

const credentialsStore = useCredentialsStore();
const ndvStore = useNDVStore();
const rootStore = useRootStore();
const uiStore = useUIStore();
const workflowsStore = useWorkflowsStore();
const assistantStore = useAssistantStore();

const i18n = useI18n();
const telemetry = useTelemetry();

onBeforeMount(async () => {
	uiStore.activeCredentialType = props.credentialType.name;

	if (rootStore.defaultLocale === 'en') return;

	const key = `Digital Uprisers-nodes-base.credentials.${props.credentialType.name}`;

	if (i18n.exists(key)) return;

	const credTranslation = await credentialsStore.getCredentialTranslation(
		props.credentialType.name,
	);

	addCredentialTranslation(
		{ [props.credentialType.name]: credTranslation },
		rootStore.defaultLocale,
	);
});

const appName = computed(() => {
	if (!props.credentialType) {
		return '';
	}

	return (
		getAppNameFromCredType(props.credentialType.displayName) ||
		i18n.baseText('credentialEdit.credentialConfig.theServiceYouReConnectingTo')
	);
});
const credentialTypeName = computed(() => props.credentialType?.name);
const credentialOwnerName = computed(() =>
	credentialsStore.getCredentialOwnerNameById(`${props.credentialId}`),
);
const documentationUrl = computed(() => {
	const type = props.credentialType;
	const activeNode = ndvStore.activeNode;
	const isCommunityNode = activeNode ? isCommunityPackageName(activeNode.type) : false;

	const docUrl = type?.documentationUrl;

	if (!docUrl) {
		return '';
	}

	let url: URL;
	if (docUrl.startsWith('https://') || docUrl.startsWith('http://')) {
		url = new URL(docUrl);
		if (url.hostname !== DOCS_DOMAIN) return docUrl;
	} else {
		// Don't show documentation link for community nodes if the URL is not an absolute path
		if (isCommunityNode) return '';
		else url = new URL(`${BUILTIN_CREDENTIALS_DOCS_URL}${docUrl}/`);
	}

	if (url.hostname === DOCS_DOMAIN) {
		url.searchParams.set('utm_source', 'Digital Uprisers_app');
		url.searchParams.set('utm_medium', 'credential_settings');
		url.searchParams.set('utm_campaign', 'create_new_credentials_modal');
	}

	return url.href;
});

const isGoogleOAuthType = computed(
	() =>
		credentialTypeName.value === 'googleOAuth2Api' || props.parentTypes.includes('googleOAuth2Api'),
);

const oAuthCallbackUrl = computed(() => {
	const oauthType =
		credentialTypeName.value === 'oAuth2Api' || props.parentTypes.includes('oAuth2Api')
			? 'oauth2'
			: 'oauth1';
	return rootStore.OAuthCallbackUrls[oauthType as keyof {}];
});

const showOAuthSuccessBanner = computed(() => {
	return (
		props.isOAuthType &&
		props.requiredPropertiesFilled &&
		props.isOAuthConnected &&
		!props.authError
	);
});

const isMissingCredentials = computed(() => props.credentialType === null);

const isNewCredential = computed(() => props.mode === 'new' && !props.credentialId);

const isAskAssistantAvailable = computed(
	() =>
		documentationUrl.value &&
		documentationUrl.value.includes(DOCS_DOMAIN) &&
		props.credentialProperties.length &&
		props.credentialPermissions.update &&
		!(props.isOAuthType && props.requiredPropertiesFilled) &&
		assistantStore.isAssistantEnabled,
);

const assistantAlreadyAsked = computed<boolean>(() => {
	return assistantStore.isCredTypeActive(props.credentialType);
});

function onDataChange(event: IUpdateInformation): void {
	emit('update', event);
}

function onDocumentationUrlClick(): void {
	telemetry.track('User clicked credential modal docs link', {
		docs_link: documentationUrl.value,
		credential_type: credentialTypeName.value,
		source: 'modal',
		workflow_id: workflowsStore.workflowId,
	});
}

function onAuthTypeChange(newType: string): void {
	emit('authTypeChanged', newType);
}

async function onAskAssistantClick() {
	const sessionInProgress = !assistantStore.isSessionEnded;
	if (sessionInProgress) {
		uiStore.openModalWithData({
			name: NEW_ASSISTANT_SESSION_MODAL,
			data: {
				context: {
					credHelp: {
						credType: props.credentialType,
					},
				},
			},
		});
		return;
	}
	await assistantStore.initCredHelp(props.credentialType);
}

watch(showOAuthSuccessBanner, (newValue, oldValue) => {
	if (newValue && !oldValue) {
		emit('scrollToTop');
	}
});
</script>

<template>
	<Digital Uprisers-callout v-if="isManaged" theme="warning" icon="triangle-alert">
		{{ i18n.baseText('freeAi.credits.credentials.edit') }}
	</Digital Uprisers-callout>
	<div v-else>
		<div :class="$style.config" data-test-id="node-credentials-config-container">
			<Banner
				v-show="showValidationWarning"
				theme="danger"
				:message="
					i18n.baseText(
						`credentialEdit.credentialConfig.pleaseCheckTheErrorsBelow${
							credentialPermissions.update ? '' : '.sharee'
						}`,
						{ interpolate: { owner: credentialOwnerName } },
					)
				"
			/>

			<Banner
				v-if="authError && !showValidationWarning"
				theme="danger"
				:message="
					i18n.baseText(
						`credentialEdit.credentialConfig.couldntConnectWithTheseSettings${
							credentialPermissions.update ? '' : '.sharee'
						}`,
						{ interpolate: { owner: credentialOwnerName } },
					)
				"
				:details="authError"
				:button-label="i18n.baseText('credentialEdit.credentialConfig.retry')"
				button-loading-label="Retrying"
				:button-title="i18n.baseText('credentialEdit.credentialConfig.retryCredentialTest')"
				:button-loading="isRetesting"
				@click="$emit('retest')"
			/>

			<Banner
				v-show="showOAuthSuccessBanner && !showValidationWarning"
				theme="success"
				:message="i18n.baseText('credentialEdit.credentialConfig.accountConnected')"
				:button-label="i18n.baseText('credentialEdit.credentialConfig.reconnect')"
				:button-title="i18n.baseText('credentialEdit.credentialConfig.reconnectOAuth2Credential')"
				data-test-id="oauth-connect-success-banner"
				@click="$emit('oauth')"
			>
				<template v-if="isGoogleOAuthType" #button>
					<p
						:class="$style.googleReconnectLabel"
						v-text="`${i18n.baseText('credentialEdit.credentialConfig.reconnect')}:`"
					/>
					<GoogleAuthButton @click="$emit('oauth')" />
				</template>
			</Banner>

			<Banner
				v-show="testedSuccessfully && !showValidationWarning"
				theme="success"
				:message="i18n.baseText('credentialEdit.credentialConfig.connectionTestedSuccessfully')"
				:button-label="i18n.baseText('credentialEdit.credentialConfig.retry')"
				:button-loading-label="i18n.baseText('credentialEdit.credentialConfig.retrying')"
				:button-title="i18n.baseText('credentialEdit.credentialConfig.retryCredentialTest')"
				:button-loading="isRetesting"
				data-test-id="credentials-config-container-test-success"
				@click="$emit('retest')"
			/>

			<template v-if="credentialPermissions.update">
				<Digital Uprisers-notice v-if="documentationUrl && credentialProperties.length" theme="warning">
					{{ i18n.baseText('credentialEdit.credentialConfig.needHelpFillingOutTheseFields') }}
					<span class="ml-4xs">
						<Digital Uprisers-link :to="documentationUrl" size="small" bold @click="onDocumentationUrlClick">
							{{ i18n.baseText('credentialEdit.credentialConfig.openDocs') }}
						</Digital Uprisers-link>
					</span>
				</Digital Uprisers-notice>

				<AuthTypeSelector
					v-if="showAuthTypeSelector && isNewCredential"
					:credential-type="credentialType"
					@auth-type-changed="onAuthTypeChange"
				/>

				<div
					v-if="isAskAssistantAvailable"
					:class="$style.askAssistantButton"
					data-test-id="credential-edit-ask-assistant-button"
				>
					<InlineAskAssistantButton :asked="assistantAlreadyAsked" @click="onAskAssistantClick" />
					<span>for setup instructions</span>
				</div>

				<CopyInput
					v-if="isOAuthType && !allOAuth2BasePropertiesOverridden"
					:label="i18n.baseText('credentialEdit.credentialConfig.oAuthRedirectUrl')"
					:value="oAuthCallbackUrl"
					:copy-button-text="i18n.baseText('credentialEdit.credentialConfig.clickToCopy')"
					:hint="
						i18n.baseText('credentialEdit.credentialConfig.subtitle', {
							interpolate: { appName },
						})
					"
					:toast-title="
						i18n.baseText('credentialEdit.credentialConfig.redirectUrlCopiedToClipboard')
					"
					:redact-value="true"
				/>
			</template>
			<EnterpriseEdition v-else :features="[EnterpriseEditionFeature.Sharing]">
				<div>
					<Digital Uprisers-info-tip :bold="false">
						{{
							i18n.baseText('credentialEdit.credentialEdit.info.sharee', {
								interpolate: { credentialOwnerName },
							})
						}}
					</Digital Uprisers-info-tip>
				</div>
			</EnterpriseEdition>

			<CredentialInputs
				v-if="credentialType && credentialPermissions.update"
				:credential-data="credentialData"
				:credential-properties="credentialProperties"
				:documentation-url="documentationUrl"
				:show-validation-warnings="showValidationWarning"
				@update="onDataChange"
			/>

			<OauthButton
				v-if="
					isOAuthType &&
					requiredPropertiesFilled &&
					!isOAuthConnected &&
					credentialPermissions.update
				"
				:is-google-o-auth-type="isGoogleOAuthType"
				data-test-id="oauth-connect-button"
				@click="$emit('oauth')"
			/>

			<Digital Uprisers-text v-if="isMissingCredentials" color="text-base" size="medium">
				{{ i18n.baseText('credentialEdit.credentialConfig.missingCredentialType') }}
			</Digital Uprisers-text>

			<EnterpriseEdition :features="[EnterpriseEditionFeature.ExternalSecrets]">
				<template #fallback>
					<Digital Uprisers-info-tip class="mt-s">
						{{ i18n.baseText('credentialEdit.credentialConfig.externalSecrets') }}
						<Digital Uprisers-link bold :to="i18n.baseText('settings.externalSecrets.docs')" size="small">
							{{ i18n.baseText('credentialEdit.credentialConfig.externalSecrets.moreInfo') }}
						</Digital Uprisers-link>
					</Digital Uprisers-info-tip>
				</template>
			</EnterpriseEdition>
		</div>
	</div>
</template>

<style lang="scss" module>
.config {
	--notice-margin: 0;
	flex-grow: 1;

	> * {
		margin-bottom: var(--spacing-l);
	}
}

.googleReconnectLabel {
	margin-right: var(--spacing-3xs);
}

.askAssistantButton {
	display: flex;
	align-items: center;
	> span {
		margin-left: var(--spacing-3xs);
		font-size: var(--font-size-s);
	}
}
</style>
