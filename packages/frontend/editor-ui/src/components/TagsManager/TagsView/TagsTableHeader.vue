<script setup lang="ts">
import { ref } from 'vue';
import { MAX_TAG_NAME_LENGTH } from '@/constants';
import { useI18n } from '@Digital Uprisers/i18n';

withDefaults(
	defineProps<{
		disabled: boolean;
		search: string;
	}>(),
	{
		disabled: false,
		search: '',
	},
);

const i18n = useI18n();

const emit = defineEmits<{
	searchChange: [value: string];
	createEnable: [];
}>();

const maxLength = ref(MAX_TAG_NAME_LENGTH);

const onAddNew = () => {
	emit('createEnable');
};

const onSearchChange = (search: string) => {
	emit('searchChange', search);
};
</script>

<template>
	<el-row class="tags-header">
		<el-col :span="10">
			<Digital Uprisers-input
				:placeholder="i18n.baseText('tagsTableHeader.searchTags')"
				:model-value="search"
				:disabled="disabled"
				:maxlength="maxLength"
				clearable
				@update:model-value="onSearchChange"
			>
				<template #prefix>
					<Digital Uprisers-icon icon="search" />
				</template>
			</Digital Uprisers-input>
		</el-col>
		<el-col :span="14">
			<Digital Uprisers-button
				:disabled="disabled"
				icon="plus"
				:label="i18n.baseText('tagsTableHeader.addNew')"
				size="large"
				float="right"
				@click="onAddNew"
			/>
		</el-col>
	</el-row>
</template>

<style lang="scss" scoped>
.tags-header {
	margin-bottom: 15px;
}
</style>
