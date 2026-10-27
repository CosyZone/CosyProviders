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

// Shared types
export type { LocalizedText, MessageRef, TranslationValue } from "./types.js";

// Footer Provider
export {
	FooterProvidingToken,
	type FooterContext,
	type FooterItem,
	type FooterColumn,
	type FooterWidget,
	type FooterWidgetSlot,
	type FooterItemContribution,
	type FooterExtension,
	type FooterProviding,
} from "./footer.js";

// Header Provider
export {
	HeaderProvidingToken,
	type HeaderContext,
	type HeaderItem,
	type HeaderAction,
	type HeaderExtension,
	type HeaderProviding,
} from "./header.js";

// Home Provider
export {
	HomeProvidingToken,
	type HomeContext,
	type HomeModule,
	type HomeProviding,
} from "./home.js";

// I18n Provider + 默认实现 + 工具函数
export {
	I18nProvidingToken,
	I18nProvider,
	type LocaleCode,
	type LocaleDescriptor,
	type TranslationCatalog,
	type I18nExtension,
	type I18nContext,
	type I18nProviding,
	// 工具函数
	defaultLocales,
	defaultLocale,
	supportedLocales,
	isChineseLocale,
} from "./i18n.js";

// Layout Provider + 默认实现
export {
	LayoutProvidingToken,
	DefaultLayoutProvider,
	type LayoutRegion,
	type LayoutDefinition,
	type LayoutView,
	type LayoutProviding,
} from "./layout.js";

// Routes Provider
export {
	RouteProvidingToken,
	type FeatureRoute,
	type RouteProviding,
} from "./routes.js";

// Crawl Provider + 匹配工具
export {
	CrawlPolicyProvidingToken,
	type CrawlRule,
	type CrawlPolicyProviding,
	// 匹配工具函数
	normalizeCrawlPath,
	stripLocalePrefix,
	matchesCrawlPrefix,
	shouldNoindexPath,
	matchesCrawlRule,
} from "./crawl.js";
