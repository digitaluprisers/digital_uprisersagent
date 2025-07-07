export type Digital UprisersLocaleTranslateFnOptions = string[] | Record<string, unknown>;

export type Digital UprisersLocaleTranslateFn = (path: string, options?: Digital UprisersLocaleTranslateFnOptions) => string;

export type Digital UprisersLocale = Record<string, string | ((...args: unknown[]) => string)>;
