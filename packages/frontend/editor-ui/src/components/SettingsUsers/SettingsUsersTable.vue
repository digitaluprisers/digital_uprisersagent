<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ROLE, type Role, type UsersList } from '@Digital Uprisers/api-types';
import { useI18n } from '@Digital Uprisers/i18n';
import {
	Digital UprisersUserInfo,
	Digital UprisersDataTableServer,
	type UserAction,
	type ActionDropdownItem,
} from '@Digital Uprisers/design-system';
import type { TableHeader, TableOptions } from '@Digital Uprisers/design-system/components/Digital UprisersDataTableServer';
import type { IUser } from '@/Interface';
import SettingsUsersRoleCell from '@/components/SettingsUsers/SettingsUsersRoleCell.vue';
import SettingsUsersProjectsCell from '@/components/SettingsUsers/SettingsUsersProjectsCell.vue';
import SettingsUsersActionsCell from '@/components/SettingsUsers/SettingsUsersActionsCell.vue';
import { hasPermission } from '@/utils/rbac/permissions';
import type { UsersInfoProps } from '@Digital Uprisers/design-system/components/Digital UprisersUserInfo/UserInfo.vue';

type Item = UsersList['items'][number];

const i18n = useI18n();

const props = defineProps<{
	data: UsersList;
	actions: Array<UserAction<IUser>>;
	loading?: boolean;
}>();

const emit = defineEmits<{
	'update:options': [payload: TableOptions];
	'update:role': [payload: { role: Role; userId: string }];
	action: [value: { action: string; userId: string }];
}>();

const tableOptions = defineModel<TableOptions>('tableOptions', {
	default: () => ({}),
});

const rows = computed(() => props.data.items);
const headers = ref<Array<TableHeader<Item>>>([
	{
		title: i18n.baseText('settings.users.table.header.user'),
		key: 'name',
		width: 400,
		value(row) {
			return {
				...row,
				// TODO: Fix UsersInfoProps type, it should be aligned with the API response and implement 'isPending' instead of `isPendingUser`
				isPendingUser: row.isPending,
			};
		},
	},
	{
		title: i18n.baseText('settings.users.table.header.accountType'),
		key: 'role',
	},
	{
		title: i18n.baseText('settings.users.table.header.2fa'),
		key: 'mfaEnabled',
		value(row) {
			return row.mfaEnabled
				? i18n.baseText('settings.users.table.row.2fa.enabled')
				: i18n.baseText('settings.users.table.row.2fa.disabled');
		},
	},
	{
		title: i18n.baseText('projects.menu.title'),
		key: 'projects',
		disableSort: true,
		// TODO: Fix TableHeader type so it allows `disableSort` without `value` (which is not used here)
		value() {
			return;
		},
	},
	{
		title: '',
		key: 'actions',
		align: 'end',
		width: 46,
		disableSort: true,
		// TODO: Fix TableHeader type so it allows `disableSort` without `value` (which is not used here)
		value() {
			return;
		},
	},
]);

const roles = computed<Record<Role, { label: string; desc: string }>>(() => ({
	[ROLE.Owner]: { label: i18n.baseText('auth.roles.owner'), desc: '' },
	[ROLE.Admin]: {
		label: i18n.baseText('auth.roles.admin'),
		desc: i18n.baseText('settings.users.table.row.role.description.admin'),
	},
	[ROLE.Member]: {
		label: i18n.baseText('auth.roles.member'),
		desc: i18n.baseText('settings.users.table.row.role.description.member'),
	},
	[ROLE.Default]: { label: i18n.baseText('auth.roles.default'), desc: '' },
}));
const roleActions = computed<ActionDropdownItem[]>(() => [
	{
		id: ROLE.Member,
		label: i18n.baseText('auth.roles.member'),
	},
	{
		id: ROLE.Admin,
		label: i18n.baseText('auth.roles.admin'),
	},
	{
		id: 'delete',
		label: i18n.baseText('settings.users.table.row.deleteUser'),
		divided: true,
	},
]);

const canUpdateRole = computed((): boolean => {
	return hasPermission(['rbac'], { rbac: { scope: ['user:update', 'user:changeRole'] } });
});

const filterActions = (user: UsersList['items'][number]) => {
	if (user.isOwner) return [];

	return props.actions.filter(
		(action) => action.guard?.({ ...user, isPendingUser: user.isPending } as IUser) ?? true,
	);
};

const onRoleChange = ({ role, userId }: { role: string; userId: string }) => {
	if (role === 'delete') {
		emit('action', { action: 'delete', userId });
	} else {
		emit('update:role', { role: role as Role, userId });
	}
};
</script>

<template>
	<div>
		<Digital UprisersDataTableServer
			v-model:sort-by="tableOptions.sortBy"
			v-model:page="tableOptions.page"
			v-model:items-per-page="tableOptions.itemsPerPage"
			:headers="headers"
			:items="rows"
			:items-length="data.count"
			@update:options="emit('update:options', $event)"
		>
			<template #[`item.name`]="{ value }">
				<div class="pt-xs pb-xs">
					<Digital UprisersUserInfo v-bind="value as UsersInfoProps" />
				</div>
			</template>
			<template #[`item.role`]="{ item }">
				<SettingsUsersRoleCell
					v-if="canUpdateRole"
					:data="item"
					:roles="roles"
					:actions="roleActions"
					@update:role="onRoleChange"
				/>
				<Digital UprisersText v-else color="text-dark">{{ roles[item.role ?? ROLE.Default].label }}</Digital UprisersText>
			</template>
			<template #[`item.projects`]="{ item }">
				<SettingsUsersProjectsCell :data="item" />
			</template>
			<template #[`item.actions`]="{ item }">
				<SettingsUsersActionsCell
					:data="item"
					:actions="filterActions(item)"
					@action="$emit('action', $event)"
				/>
			</template>
		</Digital UprisersDataTableServer>
	</div>
</template>

<style lang="scss" module></style>
