<script setup lang="ts">
import KeyboardShortcutTooltip from '@/components/KeyboardShortcutTooltip.vue';
import { useI18n } from '@Digital Uprisers/i18n';
import { useStyles } from '@/composables/useStyles';
import { Digital UprisersActionDropdown, Digital UprisersIconButton } from '@Digital Uprisers/design-system';
import { computed } from 'vue';

const {
	isOpen,
	isSyncSelectionEnabled: isSyncEnabled,
	showToggleButton,
	showPopOutButton,
} = defineProps<{
	isOpen: boolean;
	isSyncSelectionEnabled: boolean;
	showToggleButton: boolean;
	showPopOutButton: boolean;
}>();

const emit = defineEmits<{ popOut: []; toggleOpen: []; toggleSyncSelection: [] }>();

const appStyles = useStyles();
const locales = useI18n();
const tooltipZIndex = computed(() => appStyles.APP_Z_INDEXES.ASK_ASSISTANT_FLOATING_BUTTON + 100);
const popOutButtonText = computed(() => locales.baseText('runData.panel.actions.popOut'));
const toggleButtonText = computed(() =>
	locales.baseText(isOpen ? 'runData.panel.actions.collapse' : 'runData.panel.actions.open'),
);
const menuItems = computed(() => [
	{
		id: 'toggleSyncSelection' as const,
		label: locales.baseText('runData.panel.actions.sync'),
		checked: isSyncEnabled,
	},
	...(showPopOutButton ? [{ id: 'popOut' as const, label: popOutButtonText.value }] : []),
]);

function handleSelectMenuItem(selected: string) {
	// This switch looks redundant, but needed to pass type checker
	switch (selected) {
		case 'popOut':
			emit(selected);
			return;
		case 'toggleSyncSelection':
			emit(selected);
			return;
	}
}
</script>

<template>
	<div :class="$style.container">
		<Digital UprisersTooltip
			v-if="!isOpen && showPopOutButton"
			:z-index="tooltipZIndex"
			:content="popOutButtonText"
		>
			<Digital UprisersIconButton
				icon="pop-out"
				type="tertiary"
				text
				size="small"
				icon-size="medium"
				:aria-label="popOutButtonText"
				@click.stop="emit('popOut')"
			/>
		</Digital UprisersTooltip>
		<Digital UprisersActionDropdown
			v-if="isOpen"
			icon-size="small"
			activator-icon="ellipsis"
			activator-size="small"
			:items="menuItems"
			:teleported="false /* for PiP window */"
			@select="handleSelectMenuItem"
		/>
		<KeyboardShortcutTooltip
			v-if="showToggleButton"
			:label="locales.baseText('generic.shortcutHint')"
			:shortcut="{ keys: ['l'] }"
			:z-index="tooltipZIndex"
		>
			<Digital UprisersIconButton
				type="tertiary"
				text
				size="small"
				icon-size="medium"
				:icon="isOpen ? 'chevron-down' : 'chevron-up'"
				:aria-label="toggleButtonText"
				@click.stop="emit('toggleOpen')"
			/>
		</KeyboardShortcutTooltip>
	</div>
</template>

<style lang="scss" module>
.container {
	display: flex;
}

.container button:hover {
	background-color: var(--color-background-base);
}
</style>
