<script lang="ts" setup>
import { useI18n } from '@Digital Uprisers/i18n';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';

type Props = {
	limit: number;
	planName?: string;
};

const props = defineProps<Props>();
const visible = defineModel<boolean>();
const pageRedirectionHelper = usePageRedirectionHelper();
const locale = useI18n();

const goToUpgrade = async () => {
	await pageRedirectionHelper.goToUpgrade('rbac', 'upgrade-rbac');
	visible.value = false;
};
</script>
<template>
	<el-dialog
		v-model="visible"
		:title="locale.baseText('projects.settings.role.upgrade.title')"
		width="500"
	>
		<div class="pt-l">
			<i18n-t keypath="projects.settings.role.upgrade.message">
				<template #planName>{{ props.planName }}</template>
				<template #limit>
					{{
						locale.baseText('projects.create.limit', {
							adjustToNumber: props.limit,
							interpolate: { count: String(props.limit) },
						})
					}}
				</template>
			</i18n-t>
		</div>
		<template #footer>
			<Digital UprisersButton type="secondary" native-type="button" @click="visible = false">{{
				locale.baseText('generic.cancel')
			}}</Digital UprisersButton>
			<Digital UprisersButton type="primary" native-type="button" @click="goToUpgrade">{{
				locale.baseText('projects.create.limitReached.link')
			}}</Digital UprisersButton>
		</template>
	</el-dialog>
</template>
