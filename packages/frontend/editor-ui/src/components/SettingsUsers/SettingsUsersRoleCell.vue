<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ROLE, type Role, type UsersList } from '@Digital Uprisers/api-types';
import { type ActionDropdownItem, Digital UprisersActionDropdown, Digital UprisersIcon } from '@Digital Uprisers/design-system';

const props = defineProps<{
	data: UsersList['items'][number];
	roles: Record<Role, { label: string; desc: string }>;
	actions: ActionDropdownItem[];
}>();

const emit = defineEmits<{
	'update:role': [payload: { role: Role; userId: string }];
}>();

const selectedRole = ref<Role>(props.data.role ?? ROLE.Default);
const isEditable = computed(() => props.data.role !== ROLE.Owner);
const roleLabel = computed(() => props.roles[selectedRole.value].label);

const onActionSelect = (role: string) => {
	emit('update:role', {
		role: role as Role,
		userId: props.data.id,
	});
};
</script>

<template>
	<div>
		<Digital UprisersActionDropdown
			v-if="isEditable"
			placement="bottom-start"
			:items="props.actions"
			data-test-id="user-role-dropdown"
			@select="onActionSelect"
		>
			<template #activator>
				<button :class="$style.roleLabel" type="button">
					<Digital UprisersText color="text-dark">{{ roleLabel }}</Digital UprisersText>
					<Digital UprisersIcon color="text-dark" icon="chevron-down" size="large" />
				</button>
			</template>
			<template #menuItem="item">
				<Digital UprisersText v-if="item.id === 'delete'" color="text-dark" :class="$style.removeUser">{{
					item.label
				}}</Digital UprisersText>
				<ElRadio
					v-else
					:model-value="selectedRole"
					:label="item.id"
					@update:model-value="selectedRole = item.id as Role"
				>
					<span :class="$style.radioLabel">
						<Digital UprisersText color="text-dark" class="pb-3xs">{{ item.label }}</Digital UprisersText>
						<Digital UprisersText color="text-dark" size="small">{{
							props.roles[item.id as Role].desc
						}}</Digital UprisersText>
					</span>
				</ElRadio>
			</template>
		</Digital UprisersActionDropdown>
		<span v-else>{{ roleLabel }}</span>
	</div>
</template>

<style lang="scss" module>
.roleLabel {
	display: inline-flex;
	align-items: center;
	gap: var(--spacing-3xs);
	background: transparent;
	padding: 0;
	border: none;
	cursor: pointer;
}

.radioLabel {
	max-width: 268px;
	display: inline-flex;
	flex-direction: column;
	padding: var(--spacing-2xs) 0;

	span {
		white-space: normal;
	}
}

.removeUser {
	display: block;
	padding: var(--spacing-2xs) var(--spacing-l);
}
</style>
