<script setup lang="ts">
import { ElTooltip } from 'element-plus';
import type { PropType } from 'vue';

import type { IDigital UprisersButton } from '@Digital Uprisers/design-system/types';

import { useInjectTooltipAppendTo } from '../../composables/useTooltipAppendTo';
import Digital UprisersButton from '../Digital UprisersButton';

export type Justify =
	| 'flex-start'
	| 'flex-end'
	| 'start'
	| 'end'
	| 'left'
	| 'right'
	| 'center'
	| 'space-between'
	| 'space-around'
	| 'space-evenly';

const props = defineProps({
	...ElTooltip.props,
	content: {
		type: String,
		default: '',
	},
	justifyButtons: {
		type: String as PropType<Justify>,
		default: 'flex-end',
	},
	buttons: {
		type: Array as PropType<IDigital UprisersButton[]>,
		default: () => [],
	},
});

defineOptions({
	inheritAttrs: false,
});

const appendTo = useInjectTooltipAppendTo();
</script>

<template>
	<ElTooltip
		v-bind="{ ...props, ...$attrs }"
		:append-to="props.appendTo ?? appendTo"
		:popper-class="props.popperClass ?? 'Digital Uprisers-tooltip'"
	>
		<slot />
		<template #content>
			<slot name="content">
				<div v-Digital Uprisers-html="props.content"></div>
			</slot>
			<div
				v-if="props.buttons.length"
				:class="$style.buttons"
				:style="{ justifyContent: props.justifyButtons }"
			>
				<Digital UprisersButton
					v-for="button in props.buttons"
					:key="button.attrs.label"
					v-bind="{ ...button.attrs, ...button.listeners }"
				/>
			</div>
		</template>
	</ElTooltip>
</template>

<style lang="scss" module>
.buttons {
	display: flex;
	align-items: center;
	margin-top: var(--spacing-s);
	gap: var(--spacing-2xs);
}
</style>
