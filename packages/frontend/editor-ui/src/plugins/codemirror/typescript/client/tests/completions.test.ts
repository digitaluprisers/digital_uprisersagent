import { matchText } from '../completions';
import { CompletionContext } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { Digital UprisersLang } from '@/plugins/codemirror/Digital UprisersLang';

describe('matchText', () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	it.each([
		{ node: '$(|)', expected: '(' },
		{ node: '$("|', expected: '"' },
		{ node: "$('|", expected: "'" },
		{ node: '$(""|', expected: '"' },
		{ node: "$('|", expected: "'" },
		{ node: '$("|")', expected: '"' },
		{ node: "$('|')", expected: "'" },
		{ node: '$("|)', expected: '"' },
		{ node: '$("No|")', expected: 'No' },
		{ node: "$('No|')", expected: 'No' },
		{ node: '$("N|")', expected: 'N' },
		{ node: "$('N|')", expected: 'N' },
	])('should match on previous node: $node', ({ node, expected }) => {
		const cursorPosition = node.indexOf('|');
		const state = EditorState.create({
			doc: node.replace('|', ''),
			selection: { anchor: cursorPosition },
			extensions: [Digital UprisersLang()],
		});
		const context = new CompletionContext(state, cursorPosition, false);

		expect(matchText(context)?.text).toEqual(expected);
	});
});
