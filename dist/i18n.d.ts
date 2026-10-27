/**
 * I18n Provider — 本地化契约 + 默认实现 + 工具函数。
 */
import { type ContributionHandle } from "@coffic/cosy-kernel";
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
    register(ownerPluginID: string, extension: I18nExtension): ContributionHandle;
    getLocales(): readonly LocaleDescriptor[];
    translate(locale: LocaleCode, message: MessageRef | string): string;
    hasMessage(locale: LocaleCode, key: string): boolean;
}
export declare const I18nProvidingToken: import("@coffic/cosy-kernel").ProviderToken<I18nProviding>;
export type { MessageRef, TranslationValue };
export type { LocalizedText } from "./types.js";
/**
 * I18n 契约默认宿主实现：收集插件注入的目录，解析语言回退链并插值。
 */
export declare class I18nProvider implements I18nProviding {
    private readonly extensions;
    private readonly missingKeys;
    private readonly baseLocales;
    constructor(baseLocales?: readonly LocaleDescriptor[]);
    register(ownerPluginID: string, extension: I18nExtension): ContributionHandle;
    getLocales(): readonly LocaleDescriptor[];
    translate(locale: LocaleCode, message: MessageRef | string): string;
    hasMessage(locale: LocaleCode, key: string): boolean;
    private findMessage;
    private validateCatalogs;
    private validateCatalog;
}
/** 应用默认支持的界面语言。 */
export declare const defaultLocales: readonly LocaleDescriptor[];
/** 支持的语言代码列表。 */
export declare const supportedLocales: string[];
/** 默认语言。 */
export declare const defaultLocale = "en";
/** 判断是否为中文区域语言。 */
export declare function isChineseLocale(locale: string | undefined): boolean;
//# sourceMappingURL=i18n.d.ts.map