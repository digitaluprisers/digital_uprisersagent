<script setup lang="ts">
import { createEventBus } from '@Digital Uprisers/utils/event-bus';
import Modal from './Modal.vue';
import { ABOUT_MODAL_KEY } from '../constants';
import { useRootStore } from '@Digital Uprisers/stores/useRootStore';
import { useToast } from '@/composables/useToast';
import { useClipboard } from '@/composables/useClipboard';
import { useDebugInfo } from '@/composables/useDebugInfo';
import { useI18n } from '@Digital Uprisers/i18n';

const modalBus = createEventBus();
const toast = useToast();
const i18n = useI18n();
const debugInfo = useDebugInfo();
const clipboard = useClipboard();
const rootStore = useRootStore();

const closeDialog = () => {
	modalBus.emit('close');
};

const copyDebugInfoToClipboard = async () => {
	toast.showToast({
		title: i18n.baseText('about.debug.toast.title'),
		message: i18n.baseText('about.debug.toast.message'),
		type: 'info',
		duration: 5000,
	});
	await clipboard.copy(debugInfo.generateDebugInfo());
};
</script>

<template>
	<Modal
		max-width="540px"
		:title="i18n.baseText('about.aboutDigital Uprisers')"
		:event-bus="modalBus"
		:name="ABOUT_MODAL_KEY"
		:center="true"
	>
		<template #content>
			<div :class="$style.container">
				<el-row>
					<el-col :span="8" class="info-name">
						<Digital Uprisers-text>{{ i18n.baseText('about.Digital UprisersVersion') }}</Digital Uprisers-text>
					</el-col>
					<el-col :span="16">
						<Digital Uprisers-text>{{ rootStore.versionCli }}</Digital Uprisers-text>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<Digital Uprisers-text>{{ i18n.baseText('about.sourceCode') }}</Digital Uprisers-text>
					</el-col>
					<el-col :span="16">
						<Digital Uprisers-link to="https://github.com/digitaluprisers.com/Digital Uprisers">https://github.com/digitaluprisers.com/Digital Uprisers</Digital Uprisers-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<Digital Uprisers-text>{{ i18n.baseText('about.license') }}</Digital Uprisers-text>
					</el-col>
					<el-col :span="16">
						<Digital Uprisers-link to="https://github.com/digitaluprisers.com/Digital Uprisers/blob/master/LICENSE.md">
							{{ i18n.baseText('about.Digital UprisersLicense') }}
						</Digital Uprisers-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<Digital Uprisers-text>{{ i18n.baseText('about.instanceID') }}</Digital Uprisers-text>
					</el-col>
					<el-col :span="16">
						<Digital Uprisers-text>{{ rootStore.instanceId }}</Digital Uprisers-text>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<Digital Uprisers-text>{{ i18n.baseText('about.debug.title') }}</Digital Uprisers-text>
					</el-col>
					<el-col :span="16">
						<div :class="$style.debugInfo" @click="copyDebugInfoToClipboard">
							<Digital Uprisers-link>{{ i18n.baseText('about.debug.message') }}</Digital Uprisers-link>
						</div>
					</el-col>
				</el-row>
			</div>
		</template>

		<template #footer>
			<div class="action-buttons">
				<Digital Uprisers-button
					float="right"
					:label="i18n.baseText('about.close')"
					data-test-id="close-about-modal-button"
					@click="closeDialog"
				/>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.container > * {
	margin-bottom: var(--spacing-s);
	overflow-wrap: break-word;
}
</style>
