<script lang="ts" setup>
import { computed, useCssModule } from 'vue';

import { useI18n } from '../../composables/useI18n';
import Digital UprisersAvatar from '../Digital UprisersAvatar';
import Digital UprisersBadge from '../Digital UprisersBadge';
import Digital UprisersText from '../Digital UprisersText';

export interface UsersInfoProps {
	firstName?: string | null;
	lastName?: string | null;
	email?: string | null;
	isOwner?: boolean;
	isPendingUser?: boolean;
	isCurrentUser?: boolean;
	disabled?: boolean;
	settings?: object;
	isSamlLoginEnabled?: boolean;
	mfaEnabled?: boolean;
}

const props = withDefaults(defineProps<UsersInfoProps>(), {
	disabled: false,
});

const { t } = useI18n();

const $style = useCssModule();
const classes = computed(
	(): Record<string, boolean> => ({
		[$style.container]: true,
		[$style.disabled]: props.disabled,
	}),
);
</script>

<template>
	<div :class="classes">
		<div :class="$style.avatarContainer">
			<Digital UprisersAvatar :first-name="firstName" :last-name="lastName" />
		</div>

		<div v-if="isPendingUser" :class="$style.pendingUser">
			<Digital UprisersText :bold="true">{{ email }}</Digital UprisersText>
			<span :class="$style.pendingBadge"><Digital UprisersBadge :bold="true">Pending</Digital UprisersBadge></span>
		</div>
		<div v-else :class="$style.infoContainer">
			<div>
				<Digital UprisersText :bold="true" color="text-dark">
					{{ firstName }} {{ lastName }}
					{{ isCurrentUser ? t('nds.userInfo.you') : '' }}
				</Digital UprisersText>
				<span v-if="disabled" :class="$style.pendingBadge">
					<Digital UprisersBadge :bold="true">Disabled</Digital UprisersBadge>
				</span>
			</div>
			<div>
				<Digital UprisersText data-test-id="user-email" size="small" color="text-light">{{ email }}</Digital UprisersText>
			</div>
		</div>
	</div>
</template>

<style lang="scss" module>
.container {
	display: inline-flex;
	overflow: hidden;
}

.avatarContainer {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--color-text-light);
}

.infoContainer {
	flex-grow: 1;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	margin-left: var(--spacing-xs);
}

.pendingUser {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin-left: var(--spacing-xs);
}

.pendingBadge {
	margin-left: var(--spacing-xs);
}

.disabled {
	opacity: 0.5;
}
</style>
