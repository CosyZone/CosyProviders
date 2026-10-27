/**
 * I18n Provider — 本地化契约 + 默认实现 + 工具函数。
 */
import {
	createContribution,
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";
import type { MessageRef, TranslationValue } from "./types.js";

/**
 * BCP 47 风格的语言标识。
 */
export type LocaleCode = string;

/** 语言的展示描述。 */
export interface LocaleDescriptor {
	readonly code: LocaleCode;
	readonly name: string;
	readonly nativeName: string;
	readonly direction?: "ltr" | "rtl";
}

/** 单一语言的翻译目录。 */
export interface TranslationCatalog {
	readonly locale: LocaleCode;
	readonly messages: Readonly<Record<string, string>>;
}

/** 插件注入的本地化扩展。 */
export interface I18nExtension {
	readonly id: string;
	readonly order?: number;
	readonly locales?: readonly LocaleDescriptor[];
	readonly getCatalogs: () => readonly TranslationCatalog[];
}

/** 翻译解析上下文。 */
export interface I18nContext {
	readonly locale: LocaleCode;
	readonly translate: (message: MessageRef | string) => string;
}

/** 本地化契约提供方。 */
export interface I18nProviding {
	register(
		ownerPluginID: string,
		extension: I18nExtension,
	): ContributionHandle;

	getLocales(): readonly LocaleDescriptor[];

	translate(locale: LocaleCode, message: MessageRef | string): string;

	hasMessage(locale: LocaleCode, key: string): boolean;
}

export const I18nProvidingToken = defineProviderToken<I18nProviding>(
	"site.i18n",
);

// Re-export shared types
export type { MessageRef, TranslationValue };
export type { LocalizedText } from "./types.js";

// ============ 默认实现 ============

const DEFAULT_LOCALE = "en";

function normalizeLocale(locale: LocaleCode): LocaleCode {
	return locale.trim().toLowerCase().replaceAll("_", "-");
}

function getFallbackLocales(locale: LocaleCode): readonly LocaleCode[] {
	const normalized = normalizeLocale(locale);
	const segments = normalized.split("-");
	const fallbacks: LocaleCode[] = [];

	for (let index = segments.length; index > 0; index -= 1) {
		fallbacks.push(segments.slice(0, index).join("-"));
	}
	if (!fallbacks.includes(DEFAULT_LOCALE)) fallbacks.push(DEFAULT_LOCALE);
	return fallbacks;
}

function interpolate(
	message: string,
	values: MessageRef["values"],
): string {
	if (!values) return message;
	return message.replace(/\{([\w.-]+)\}/g, (placeholder, key: string) => {
		const value = values[key];
		return value === undefined ? placeholder : String(value);
	});
}

interface RegisteredExtension {
	readonly ownerPluginID: string;
	readonly extension: I18nExtension;
}

/**
 * I18n 契约默认宿主实现：收集插件注入的目录，解析语言回退链并插值。
 */
export class I18nProvider implements I18nProviding {
	private readonly extensions = new Map<string, RegisteredExtension>();
	private readonly missingKeys = new Set<string>();
	private readonly baseLocales: readonly LocaleDescriptor[];

	constructor(baseLocales: readonly LocaleDescriptor[] = []) {
		this.baseLocales = baseLocales;
	}

	register(
		ownerPluginID: string,
		extension: I18nExtension,
	): ContributionHandle {
		if (this.extensions.has(extension.id)) {
			throw new Error(`Duplicate i18n extension '${extension.id}'`);
		}

		this.validateCatalogs(extension);
		this.extensions.set(extension.id, { ownerPluginID, extension });
		return createContribution(ownerPluginID, () =>
			this.extensions.delete(extension.id),
		);
	}

	getLocales(): readonly LocaleDescriptor[] {
		const locales = new Map<string, LocaleDescriptor>();
		for (const locale of this.baseLocales) {
			locales.set(normalizeLocale(locale.code), {
				...locale,
				code: normalizeLocale(locale.code),
			});
		}
		for (const { extension } of this.extensions.values()) {
			for (const locale of extension.locales ?? []) {
				locales.set(normalizeLocale(locale.code), {
					...locale,
					code: normalizeLocale(locale.code),
				});
			}
			for (const catalog of extension.getCatalogs()) {
				const code = normalizeLocale(catalog.locale);
				if (!locales.has(code)) {
					locales.set(code, {
						code,
						name: code,
						nativeName: code,
					});
				}
			}
		}
		return [...locales.values()];
	}

	translate(locale: LocaleCode, message: MessageRef | string): string {
		if (typeof message === "string") return message;

		for (const fallbackLocale of getFallbackLocales(locale)) {
			const translation = this.findMessage(fallbackLocale, message.key);
			if (translation !== undefined) {
				return interpolate(translation, message.values);
			}
		}

		const missingKey = `${normalizeLocale(locale)}:${message.key}`;
		if (!this.missingKeys.has(missingKey)) {
			this.missingKeys.add(missingKey);
			console.warn(`[i18n] Missing translation: ${missingKey}`);
		}
		return interpolate(message.fallback ?? message.key, message.values);
	}

	hasMessage(locale: LocaleCode, key: string): boolean {
		return getFallbackLocales(locale).some(
			(fallbackLocale) => this.findMessage(fallbackLocale, key) !== undefined,
		);
	}

	private findMessage(locale: LocaleCode, key: string): string | undefined {
		for (const { extension } of this.extensions.values()) {
			for (const catalog of extension.getCatalogs()) {
				if (normalizeLocale(catalog.locale) !== locale) continue;
				const message = catalog.messages[key];
				if (message !== undefined) return message;
			}
		}
		return undefined;
	}

	private validateCatalogs(extension: I18nExtension): void {
		const seen = new Set<string>();
		for (const catalog of extension.getCatalogs()) {
			this.validateCatalog(catalog);
			const locale = normalizeLocale(catalog.locale);
			for (const key of Object.keys(catalog.messages)) {
				const identity = `${locale}:${key}`;
				if (seen.has(identity)) {
					throw new Error(
						`Duplicate translation '${identity}' in i18n extension '${extension.id}'`,
					);
				}
				seen.add(identity);
			}
		}
	}

	private validateCatalog(catalog: TranslationCatalog): void {
		if (!normalizeLocale(catalog.locale)) {
			throw new Error("I18n catalog locale must not be empty");
		}
		for (const [key, value] of Object.entries(catalog.messages)) {
			if (!key.trim()) throw new Error("I18n message key must not be empty");
			if (typeof value !== "string") {
				throw new TypeError(`I18n message '${key}' must be a string`);
			}
		}
	}
}

// ============ 工具函数 ============

/** 应用默认支持的界面语言。 */
export const defaultLocales: readonly LocaleDescriptor[] = [
	{ code: "zh-cn", name: "Chinese (Simplified)", nativeName: "简体中文" },
	{ code: "en", name: "English", nativeName: "English" },
];

/** 支持的语言代码列表。 */
export const supportedLocales = defaultLocales.map((locale) => locale.code);

/** 默认语言。 */
export const defaultLocale = "en";

/** 判断是否为中文区域语言。 */
export function isChineseLocale(locale: string | undefined): boolean {
	return locale?.trim().toLowerCase().startsWith("zh") ?? false;
}
