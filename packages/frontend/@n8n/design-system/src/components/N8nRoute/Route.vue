<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface RouteProps {
	to?: RouteLocationRaw | string;
	newWindow?: boolean;
}

defineOptions({ name: 'Digital UprisersRoute' });
const props = defineProps<RouteProps>();

const useRouterLink = computed(() => {
	if (props.newWindow) {
		// router-link does not support click events and opening in new window
		return false;
	}

	if (typeof props.to === 'string') {
		return props.to.startsWith('/');
	}

	return props.to !== undefined;
});

const openNewWindow = computed(() => !useRouterLink.value);
</script>

<template>
	<RouterLink v-if="useRouterLink && to" :to="to" role="link" v-bind="$attrs">
		<slot></slot>
	</RouterLink>
	<a
		v-else
		:href="to ? `${to}` : undefined"
		:target="openNewWindow ? '_blank' : '_self'"
		v-bind="$attrs"
	>
		<slot></slot>
	</a>
</template>
