<template>
	<span>
		<Digital Uprisers-tooltip content=" " placement="top">
			<template #content>
				<slot />
			</template>
			<Digital Uprisers-icon :class="$style['icon']" icon="triangle-alert" />
		</Digital Uprisers-tooltip>
	</span>
</template>

<style lang="scss" module>
.icon {
	font-size: 14px;
	height: 18px;
	color: $warning-tooltip-color;
}
</style>
