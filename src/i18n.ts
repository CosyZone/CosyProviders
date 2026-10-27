/**
 * I18n Provider：本地化契约。
 *
 * 收集插件注入的语言目录，解析语言回退链并插值。
 * 取 kuaiyizhi-web 超集接口，cofficlab 可使用子集功能。
 */
import {
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";
import type { LocalizedText, MessageRef, TranslationValue } from "./types.js";

/**
 * BCP 47 风格的语言标识，例如 `zh-cn`、`en` 或 `ja`。
 *
 * 语言集合由已注册的本地化实现提供，不在契约层写死。
 */
export type LocaleCode = string;

/** 语言的展示描述：代码、英文名、本地名与书写方向。 */
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

/** 插件注入的本地化扩展：可声明语言与翻译目录。 */
export interface I18nExtension {
	readonly id: string;
	readonly order?: number;
	readonly locales?: readonly LocaleDescriptor[];
	readonly getCatalogs: () => readonly TranslationCatalog[];
}

/** 翻译解析上下文：当前语言与翻译函数。 */
export interface I18nContext {
	readonly locale: LocaleCode;
	readonly translate: (message: MessageRef | string) => string;
}

/** 本地化契约提供方：收集插件注入的目录，解析语言回退链并插值。 */
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

// Re-export shared types that are commonly used with I18n
export type { LocalizedText, MessageRef, TranslationValue };
