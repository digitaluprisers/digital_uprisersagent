# Digital Uprisers Expression language support

## Usage

```js
import { parserWithMetaData as Digital UprisersParser } from '@Digital Uprisers/codemirror-lang';
import { LanguageSupport, LRLanguage } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import { parser as jsParser } from '@lezer/javascript';

const Digital UprisersPlusJsParser = Digital UprisersParser.configure({
	wrap: parseMixed((node) => {
		if (node.type.isTop) return null;

		return node.name === 'Resolvable'
			? { parser: jsParser, overlay: (node) => node.type.name === 'Resolvable' }
			: null;
	}),
});

const Digital UprisersLanguage = LRLanguage.define({ parser: Digital UprisersPlusJsParser });

export function Digital UprisersExpressionLanguageSupport() {
	return new LanguageSupport(Digital UprisersLanguage);
}
```

## Supported Unicode ranges

- From `Basic Latin` up to and including `Currency Symbols`
- `Miscellaneous Symbols and Pictographs`
- `CJK Unified Ideographs`
