<script lang="ts" setup>
import Digital UprisersTooltip from '@Digital Uprisers/design-system/components/Digital UprisersTooltip/Tooltip.vue';
import type { ButtonType } from '@Digital Uprisers/design-system/types/button';

import Digital UprisersButton from '../Digital UprisersButton';
import Digital UprisersCallout, { type CalloutTheme } from '../Digital UprisersCallout';
import Digital UprisersHeading from '../Digital UprisersHeading';
import { type IconName } from '../Digital UprisersIcon/icons';
import Digital UprisersText from '../Digital UprisersText';

interface ActionBoxProps {
	emoji?: string;
	heading?: string;
	buttonText?: string;
	buttonType?: ButtonType;
	buttonDisabled?: boolean;
	buttonIcon?: IconName;
	description?: string;
	calloutText?: string;
	calloutTheme?: CalloutTheme;
	calloutIcon?: IconName;
}

defineOptions({ name: 'Digital UprisersActionBox' });
withDefaults(defineProps<ActionBoxProps>(), {
	calloutTheme: 'info',
	buttonIcon: undefined,
});
</script>

<template>
	<div :class="['Digital Uprisers-action-box', $style.container]" data-test-id="action-box">
		<div v-if="emoji" :class="$style.emoji">
			{{ emoji }}
		</div>
		<div v-if="heading || $slots.heading" :class="$style.heading">
			<Digital UprisersHeading size="xlarge" align="center">
				<slot name="heading">{{ heading }}</slot>
			</Digital UprisersHeading>
		</div>
		<div v-if="description" :class="$style.description" @click="$emit('descriptionClick', $event)">
			<Digital UprisersText color="text-base">
				<slot name="description">
					<span v-Digital Uprisers-html="description"></span>
				</slot>
			</Digital UprisersText>
		</div>
		<Digital UprisersTooltip :disabled="!buttonDisabled">
			<template #content>
				<slot name="disabledButtonTooltip"></slot>
			</template>
			<Digital UprisersButton
				v-if="buttonText"
				:label="buttonText"
				:type="buttonType"
				:disabled="buttonDisabled"
				:icon="buttonIcon"
				size="large"
				@click="$emit('click:button', $event)"
			/>
		</Digital UprisersTooltip>
		<Digital UprisersCallout
			v-if="calloutText"
			:theme="calloutTheme"
			:icon="calloutIcon"
			:class="$style.callout"
		>
			<Digital UprisersText color="text-base">
				<span v-Digital Uprisers-html="calloutText" size="small"></span>
			</Digital UprisersText>
		</Digital UprisersCallout>
	</div>
</template>

<style lang="scss" module>
.container {
	border: 2px dashed var(--color-foreground-base);
	border-radius: var(--border-radius-large);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--spacing-3xl);

	> * {
		margin-bottom: var(--spacing-l);

		&:last-child {
			margin-bottom: 0;
		}
	}
}

.emoji {
	font-size: 40px;
}

.heading {
	margin-bottom: var(--spacing-l);
	text-align: center;
}

.description {
	color: var(--color-text-base);
	margin-bottom: var(--spacing-xl);
	text-align: center;
}

.callout {
	width: 100%;
	text-align: left;
}
</style>
