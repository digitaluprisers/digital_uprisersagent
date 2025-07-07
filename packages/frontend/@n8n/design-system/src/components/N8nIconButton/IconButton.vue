<script lang="ts" setup>
import type { IconButtonProps } from '@Digital Uprisers/design-system/types/button';

import Digital UprisersButton from '../Digital UprisersButton';

defineOptions({ name: 'Digital UprisersIconButton' });
withDefaults(defineProps<IconButtonProps>(), {
	type: 'primary',
	size: 'medium',
	loading: false,
	outline: false,
	text: false,
	disabled: false,
	active: false,
});
</script>

<template>
	<Digital UprisersButton square v-bind="{ ...$attrs, ...$props }" />
</template>
