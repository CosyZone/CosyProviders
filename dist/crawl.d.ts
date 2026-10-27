/**
 * Crawl Provider — 爬虫索引策略契约 + 匹配工具。
 */
import { type ContributionHandle } from "@coffic/cosy-kernel";
/**
 * 插件声明的「不要索引」规则。
 */
export interface CrawlRule {
    readonly path: string;
    readonly reason?: string;
    readonly exact?: boolean;
    readonly scope?: "localized" | "bare";
}
/**
 * 爬虫索引策略契约提供方。
 */
export interface CrawlPolicyProviding {
    exclude(ownerPluginID: string, rule: CrawlRule): ContributionHandle;
    rules(): readonly CrawlRule[];
    shouldNoindex(pathname: string, locales: readonly string[]): boolean;
}
export declare const CrawlPolicyProvidingToken: import("@coffic/cosy-kernel").ProviderToken<CrawlPolicyProviding>;
/** 归一化逻辑路径：补前导 `/`、去掉尾随 `/`，根路径固定为 `/`。 */
export declare function normalizeCrawlPath(path: string): string;
/**
 * 剥离语言前缀，得到不含语言段的逻辑路径。
 */
export declare function stripLocalePrefix(pathname: string, locales: readonly string[]): string;
/**
 * 按路径段边界做前缀匹配。
 */
export declare function matchesCrawlPrefix(path: string, prefix: string): boolean;
/**
 * 判断某路径是否命中任一 noindex 规则。
 */
export declare function shouldNoindexPath(rules: readonly CrawlRule[], pathname: string, locales: readonly string[]): boolean;
/**
 * 判断给定路径是否匹配某条 CrawlRule。
 */
export declare function matchesCrawlRule(pathname: string, rule: CrawlRule): boolean;
//# sourceMappingURL=crawl.d.ts.map