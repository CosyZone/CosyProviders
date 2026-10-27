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
// Footer Provider
export { FooterProvidingToken, } from "./footer.js";
// Header Provider
export { HeaderProvidingToken, } from "./header.js";
// Home Provider
export { HomeProvidingToken, } from "./home.js";
// I18n Provider + 默认实现 + 工具函数
export { I18nProvidingToken, I18nProvider, 
// 工具函数
defaultLocales, defaultLocale, supportedLocales, isChineseLocale, } from "./i18n.js";
// Layout Provider + 默认实现
export { LayoutProvidingToken, DefaultLayoutProvider, } from "./layout.js";
// Routes Provider
export { RouteProvidingToken, } from "./routes.js";
// Crawl Provider + 匹配工具
export { CrawlPolicyProvidingToken, 
// 匹配工具函数
normalizeCrawlPath, stripLocalePrefix, matchesCrawlPrefix, shouldNoindexPath, matchesCrawlRule, } from "./crawl.js";
//# sourceMappingURL=index.js.map