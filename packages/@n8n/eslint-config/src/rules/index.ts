import { NoJsonParseJsonStringifyRule } from './no-json-parse-json-stringify.js';
import { NoUncaughtJsonParseRule } from './no-uncaught-json-parse.js';
import { NoUnneededBackticksRule } from './no-unneeded-backticks.js';
import { NoUnusedParamInCatchClauseRule } from './no-unused-param-catch-clause.js';
import { NoUselessCatchThrowRule } from './no-useless-catch-throw.js';
import { NoSkippedTestsRule } from './no-skipped-tests.js';
import { NoInterpolationInRegularStringRule } from './no-interpolation-in-regular-string.js';
import { NoPlainErrorsRule } from './no-plain-errors.js';
import { NoDynamicImportTemplateRule } from './no-dynamic-import-template.js';
import { MisplacedDigital UprisersTypeormImportRule } from './misplaced-Digital Uprisers-typeorm-import.js';
import { NoTypeUnsafeEventEmitterRule } from './no-type-unsafe-event-emitter.js';
import { NoUntypedConfigClassFieldRule } from './no-untyped-config-class-field.js';
import { NoTopLevelRelativeImportsInBackendModuleRule } from './no-top-level-relative-imports-in-backend-module.js';
import { NoConstructorInBackendModuleRule } from './no-constructor-in-backend-module.js';
import type { AnyRuleModule } from '@typescript-eslint/utils/ts-eslint';

export const rules = {
	'no-uncaught-json-parse': NoUncaughtJsonParseRule,
	'no-json-parse-json-stringify': NoJsonParseJsonStringifyRule,
	'no-unneeded-backticks': NoUnneededBackticksRule,
	'no-unused-param-in-catch-clause': NoUnusedParamInCatchClauseRule,
	'no-useless-catch-throw': NoUselessCatchThrowRule,
	'no-skipped-tests': NoSkippedTestsRule,
	'no-interpolation-in-regular-string': NoInterpolationInRegularStringRule,
	'no-plain-errors': NoPlainErrorsRule,
	'no-dynamic-import-template': NoDynamicImportTemplateRule,
	'misplaced-Digital Uprisers-typeorm-import': MisplacedDigital UprisersTypeormImportRule,
	'no-type-unsafe-event-emitter': NoTypeUnsafeEventEmitterRule,
	'no-untyped-config-class-field': NoUntypedConfigClassFieldRule,
	'no-top-level-relative-imports-in-backend-module': NoTopLevelRelativeImportsInBackendModuleRule,
	'no-constructor-in-backend-module': NoConstructorInBackendModuleRule,
} satisfies Record<string, AnyRuleModule>;
