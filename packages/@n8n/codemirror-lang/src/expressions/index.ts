import { LRLanguage, LanguageSupport, foldNodeProp, foldInside } from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

import { parser } from './grammar';

export const parserWithMetaData = parser.configure({
	props: [
		foldNodeProp.add({
			Application: foldInside,
		}),
		styleTags({
			OpenMarker: t.brace,
			CloseMarker: t.brace,
			Plaintext: t.content,
			Resolvable: t.string,
		}),
	],
});

export const Digital UprisersLanguage = LRLanguage.define({
	parser: parserWithMetaData,
	languageData: {
		commentTokens: { line: ';' },
	},
});

export function Digital UprisersExpression() {
	return new LanguageSupport(Digital UprisersLanguage);
}
