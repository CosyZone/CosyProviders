/**
 * I18n Provider — 本地化契约 + 默认实现 + 工具函数。
 */
import { createContribution, defineProviderToken, } from "@coffic/cosy-kernel";
export const I18nProvidingToken = defineProviderToken("site.i18n");
// ============ 默认实现 ============
const DEFAULT_LOCALE = "en";
function normalizeLocale(locale) {
    return locale.trim().toLowerCase().replaceAll("_", "-");
}
function getFallbackLocales(locale) {
    const normalized = normalizeLocale(locale);
    const segments = normalized.split("-");
    const fallbacks = [];
    for (let index = segments.length; index > 0; index -= 1) {
        fallbacks.push(segments.slice(0, index).join("-"));
    }
    if (!fallbacks.includes(DEFAULT_LOCALE))
        fallbacks.push(DEFAULT_LOCALE);
    return fallbacks;
}
function interpolate(message, values) {
    if (!values)
        return message;
    return message.replace(/\{([\w.-]+)\}/g, (placeholder, key) => {
        const value = values[key];
        return value === undefined ? placeholder : String(value);
    });
}
/**
 * I18n 契约默认宿主实现：收集插件注入的目录，解析语言回退链并插值。
 */
export class I18nProvider {
    extensions = new Map();
    missingKeys = new Set();
    baseLocales;
    constructor(baseLocales = []) {
        this.baseLocales = baseLocales;
    }
    register(ownerPluginID, extension) {
        if (this.extensions.has(extension.id)) {
            throw new Error(`Duplicate i18n extension '${extension.id}'`);
        }
        this.validateCatalogs(extension);
        this.extensions.set(extension.id, { ownerPluginID, extension });
        return createContribution(ownerPluginID, () => this.extensions.delete(extension.id));
    }
    getLocales() {
        const locales = new Map();
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
    translate(locale, message) {
        if (typeof message === "string")
            return message;
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
    hasMessage(locale, key) {
        return getFallbackLocales(locale).some((fallbackLocale) => this.findMessage(fallbackLocale, key) !== undefined);
    }
    findMessage(locale, key) {
        for (const { extension } of this.extensions.values()) {
            for (const catalog of extension.getCatalogs()) {
                if (normalizeLocale(catalog.locale) !== locale)
                    continue;
                const message = catalog.messages[key];
                if (message !== undefined)
                    return message;
            }
        }
        return undefined;
    }
    validateCatalogs(extension) {
        const seen = new Set();
        for (const catalog of extension.getCatalogs()) {
            this.validateCatalog(catalog);
            const locale = normalizeLocale(catalog.locale);
            for (const key of Object.keys(catalog.messages)) {
                const identity = `${locale}:${key}`;
                if (seen.has(identity)) {
                    throw new Error(`Duplicate translation '${identity}' in i18n extension '${extension.id}'`);
                }
                seen.add(identity);
            }
        }
    }
    validateCatalog(catalog) {
        if (!normalizeLocale(catalog.locale)) {
            throw new Error("I18n catalog locale must not be empty");
        }
        for (const [key, value] of Object.entries(catalog.messages)) {
            if (!key.trim())
                throw new Error("I18n message key must not be empty");
            if (typeof value !== "string") {
                throw new TypeError(`I18n message '${key}' must be a string`);
            }
        }
    }
}
// ============ 工具函数 ============
/** 应用默认支持的界面语言。 */
export const defaultLocales = [
    { code: "zh-cn", name: "Chinese (Simplified)", nativeName: "简体中文" },
    { code: "en", name: "English", nativeName: "English" },
];
/** 支持的语言代码列表。 */
export const supportedLocales = defaultLocales.map((locale) => locale.code);
/** 默认语言。 */
export const defaultLocale = "en";
/** 判断是否为中文区域语言。 */
export function isChineseLocale(locale) {
    return locale?.trim().toLowerCase().startsWith("zh") ?? false;
}
//# sourceMappingURL=i18n.js.map