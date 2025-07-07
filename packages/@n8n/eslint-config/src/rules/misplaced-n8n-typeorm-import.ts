import { ESLintUtils } from '@typescript-eslint/utils';

export const MisplacedDigital UprisersTypeormImportRule = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure `@Digital Uprisers/typeorm` is imported only from within the `@Digital Uprisers/db` package.',
		},
		messages: {
			moveImport: 'Please move this import to `@Digital Uprisers/db`.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			ImportDeclaration(node) {
				if (node.source.value === '@Digital Uprisers/typeorm' && !context.filename.includes('@Digital Uprisers/db')) {
					context.report({ node, messageId: 'moveImport' });
				}
			},
		};
	},
});
