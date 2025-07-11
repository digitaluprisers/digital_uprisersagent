<script lang="ts" setup>
import type { TextColor } from '@Digital Uprisers/design-system/types/text';

import Digital UprisersIcon from '../Digital UprisersIcon';
import Digital UprisersText from '../Digital UprisersText';
import Digital UprisersTooltip from '../Digital UprisersTooltip';

const SIZE = ['small', 'medium', 'large'] as const;

interface InputLabelProps {
	compact?: boolean;
	color?: TextColor;
	label?: string;
	tooltipText?: string;
	inputName?: string;
	required?: boolean;
	bold?: boolean;
	size?: (typeof SIZE)[number];
	underline?: boolean;
	showTooltip?: boolean;
	showOptions?: boolean;
}

defineOptions({ name: 'Digital UprisersInputLabel' });
withDefaults(defineProps<InputLabelProps>(), {
	compact: false,
	bold: true,
	size: 'medium',
});

const addTargetBlank = (html: string) =>
	html && html.includes('href=') ? html.replace(/href=/g, 'target="_blank" href=') : html;
</script>

<template>
	<div
		:class="{
			[$style.container]: true,
			[$style.withOptions]: $slots.options,
		}"
		v-bind="$attrs"
		data-test-id="input-label"
	>
		<div :class="$style.labelRow">
			<label
				v-if="label || $slots.options"
				:for="inputName"
				:class="{
					'Digital Uprisers-input-label': true,
					[$style.inputLabel]: true,
					[$style.heading]: !!label,
					[$style.underline]: underline,
					[$style[size]]: true,
					[$style.overflow]: !!$slots.options,
				}"
			>
				<div :class="$style['main-content']">
					<div v-if="label" :class="$style.title">
						<Digital UprisersText
							:bold="bold"
							:size="size"
							:compact="compact"
							:color="color"
							:class="{
								[$style.textEllipses]: showOptions,
							}"
						>
							{{ label }}
							<Digital UprisersText v-if="required" color="primary" :bold="bold" :size="size">*</Digital UprisersText>
						</Digital UprisersText>
					</div>
					<span
						v-if="tooltipText && label"
						:class="[$style.infoIcon, showTooltip ? $style.visible : $style.hidden]"
					>
						<Digital UprisersTooltip placement="top" :popper-class="$style.tooltipPopper" :show-after="300">
							<Digital UprisersIcon :class="$style.icon" icon="circle-help" size="small" />
							<template #content>
								<div v-Digital Uprisers-html="addTargetBlank(tooltipText)" />
							</template>
						</Digital UprisersTooltip>
					</span>
				</div>
				<div :class="$style['trailing-content']">
					<div
						v-if="$slots.options && label"
						:class="{ [$style.overlay]: true, [$style.visible]: showOptions }"
					/>
					<div
						v-if="$slots.options"
						:class="{ [$style.options]: true, [$style.visible]: showOptions }"
						:data-test-id="`${inputName}-parameter-input-options-container`"
					>
						<slot name="options" />
					</div>
					<div
						v-if="$slots.issues"
						:class="$style.issues"
						:data-test-id="`${inputName}-parameter-input-issues-container`"
					>
						<slot name="issues" />
					</div>
				</div>
			</label>
			<div
				v-if="$slots.persistentOptions"
				class="pl-4xs"
				:data-test-id="`${inputName}-parameter-input-persistent-options-container`"
			>
				<slot name="persistentOptions" />
			</div>
		</div>
		<slot />
	</div>
</template>

<style lang="scss" module>
.container {
	display: flex;
	flex-direction: column;

	label {
		display: flex;
		justify-content: space-between;
	}
}

.labelRow {
	flex-direction: row;
	display: flex;
}

.main-content {
	display: flex;
	&:hover {
		.infoIcon {
			opacity: 1;

			&:hover {
				color: var(--color-text-base);
			}
		}
	}
}

.infoIcon:has(.icon[aria-describedby]) {
	opacity: 1;
}

.trailing-content {
	display: flex;
	gap: var(--spacing-3xs);

	* {
		align-self: center;
	}
}

.inputLabel {
	display: block;
	flex-grow: 1;
}
.container:hover,
.inputLabel:hover {
	.options {
		opacity: 1;
		transition: opacity 100ms ease-in; // transition on hover in
	}

	.overlay {
		opacity: 1;
		transition: opacity 100ms ease-in; // transition on hover in
	}
}
.withOptions:hover {
	.title > span {
		text-overflow: ellipsis;
		overflow: hidden;
	}
}

.title {
	display: flex;
	align-items: center;
	min-width: 0;

	> * {
		white-space: nowrap;
	}
}

.infoIcon {
	display: flex;
	align-items: center;
	color: var(--color-text-light);
	margin-left: var(--spacing-4xs);
	z-index: 1;
}

.options {
	opacity: 0;
	transition: opacity 250ms cubic-bezier(0.98, -0.06, 0.49, -0.2); // transition on hover out
	display: flex;
	align-self: center;
}

.issues {
	display: flex;
	align-self: center;
}

.overlay {
	position: relative;
	flex-grow: 1;
	opacity: 0;
	transition: opacity 250ms cubic-bezier(0.98, -0.06, 0.49, -0.2); // transition on hover out

	> div {
		position: absolute;
		width: 60px;
		height: 19px;
		top: 0;
		right: 0;
		z-index: 0;

		background: linear-gradient(
			270deg,
			var(--color-foreground-xlight) 72.19%,
			rgba(255, 255, 255, 0) 107.45%
		);
	}
}

.hidden {
	opacity: 0;
}

.visible {
	opacity: 1;
}

.overflow {
	overflow-x: hidden;
	overflow-y: clip;
}

.textEllipses {
	text-overflow: ellipsis;
	overflow: hidden;
}

.heading {
	display: flex;

	&.small {
		padding-bottom: var(--spacing-5xs);
	}
	&.medium {
		padding-bottom: var(--spacing-2xs);
	}
}

.underline {
	border-bottom: var(--border-base);
}

:root .tooltipPopper {
	line-height: var(--font-line-height-compact);
	max-width: 400px;

	li {
		margin-left: var(--spacing-s);
	}

	code {
		color: var(--color-text-dark);
		font-size: var(--font-size-3xs);
		background: var(--color-background-medium);
		padding: var(--spacing-5xs);
		border-radius: var(--border-radius-base);
	}
}
</style>
