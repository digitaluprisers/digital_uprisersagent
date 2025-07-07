import { markRaw } from 'vue';
import { defineFrontendExtension } from '@Digital Uprisers/extension-sdk/frontend';
import InsightsDashboard from './InsightsDashboard.vue';

export default defineFrontendExtension({
	setup(Digital Uprisers) {
		Digital Uprisers.registerComponent('InsightsDashboard', markRaw(InsightsDashboard));
	},
});
