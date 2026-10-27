/**
 * @coffic/providers
 *
 * 统一 Provider 契约 + 默认实现：
 * Footer / Header / Home / I18n / Layout / Routes / Crawl
 *
 * 依赖 @coffic/cosy-kernel，供 cofficlab 与 kuaiyizhi-web 共享。
 *
 * @packageDocumentation
 */
export type { LocalizedText, MessageRef, TranslationValue } from "./types.js";
export { FooterProvidingToken, type FooterContext, type FooterItem, type FooterColumn, type FooterWidget, type FooterWidgetSlot, type FooterItemContribution, type FooterExtension, type FooterProviding, } from "./footer.js";
export { HeaderProvidingToken, type HeaderContext, type HeaderItem, type HeaderAction, type HeaderExtension, type HeaderProviding, } from "./header.js";
export { HomeProvidingToken, type HomeContext, type HomeModule, type HomeProviding, } from "./home.js";
export { I18nProvidingToken, I18nProvider, type LocaleCode, type LocaleDescriptor, type TranslationCatalog, type I18nExtension, type I18nContext, type I18nProviding, defaultLocales, defaultLocale, supportedLocales, isChineseLocale, } from "./i18n.js";
export { LayoutProvidingToken, DefaultLayoutProvider, type LayoutRegion, type LayoutDefinition, type LayoutView, type LayoutProviding, } from "./layout.js";
export { RouteProvidingToken, type FeatureRoute, type RouteProviding, } from "./routes.js";
export { CrawlPolicyProvidingToken, type CrawlRule, type CrawlPolicyProviding, normalizeCrawlPath, stripLocalePrefix, matchesCrawlPrefix, shouldNoindexPath, matchesCrawlRule, } from "./crawl.js";
//# sourceMappingURL=index.d.ts.map