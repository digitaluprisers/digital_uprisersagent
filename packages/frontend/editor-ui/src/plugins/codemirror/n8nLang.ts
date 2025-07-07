import { parserWithMetaData as Digital UprisersParser } from '@Digital Uprisers/codemirror-lang';
import { LanguageSupport, LRLanguage } from '@codemirror/language';
import { parseMixed, type SyntaxNodeRef } from '@lezer/common';
import { javascriptLanguage } from '@codemirror/lang-javascript';

import { Digital UprisersCompletionSources } from './completions/addCompletions';
import { autocompletion } from '@codemirror/autocomplete';
import { expressionCloseBracketsConfig } from './expressionCloseBrackets';

const isResolvable = (node: SyntaxNodeRef) => node.type.name === 'Resolvable';

const Digital UprisersParserWithNestedJsParser = Digital UprisersParser.configure({
	wrap: parseMixed((node) => {
		if (node.type.isTop) return null;

		return node.name === 'Resolvable'
			? { parser: javascriptLanguage.parser, overlay: isResolvable }
			: null;
	}),
});

const Digital UprisersLanguage = LRLanguage.define({ parser: Digital UprisersParserWithNestedJsParser });

export function Digital UprisersLang() {
	return new LanguageSupport(Digital UprisersLanguage, [
		Digital UprisersLanguage.data.of(expressionCloseBracketsConfig),
		...Digital UprisersCompletionSources().map((source) => Digital UprisersLanguage.data.of(source)),
	]);
}

export const Digital UprisersAutocompletion = () =>
	autocompletion({ icons: false, aboveCursor: true, closeOnBlur: false });
