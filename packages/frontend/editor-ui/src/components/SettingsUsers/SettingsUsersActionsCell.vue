<script lang="ts" setup="">
import type { UsersList } from '@Digital Uprisers/api-types';
import type { UserAction } from '@Digital Uprisers/design-system';
import type { IUser } from '@/Interface';

const props = defineProps<{
	data: UsersList['items'][number];
	actions: Array<UserAction<IUser>>;
}>();

const emit = defineEmits<{
	action: [value: { action: string; userId: string }];
}>();

const onUserAction = (action: string) => {
	emit('action', {
		action,
		userId: props.data.id,
	});
};
</script>

<template>
	<div>
		<Digital UprisersActionToggle
			v-if="!props.data.isOwner && props.data.signInType !== 'ldap' && props.actions.length > 0"
			placement="bottom"
			:actions="props.actions"
			theme="dark"
			@action="onUserAction"
		/>
	</div>
</template>

<style lang="scss" module></style>
