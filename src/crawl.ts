/**
 * Crawl Provider — 爬虫索引策略契约 + 匹配工具。
 */
import {
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";

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

export const CrawlPolicyProvidingToken = defineProviderToken<CrawlPolicyProviding>(
	"site.crawl",
);

// ============ 匹配工具函数 ============

/** 归一化逻辑路径：补前导 `/`、去掉尾随 `/`，根路径固定为 `/`。 */
export function normalizeCrawlPath(path: string): string {
	const trimmed = path.trim();
	if (!trimmed || trimmed === "/") return "/";
	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withLeadingSlash.replace(/\/+$/, "") || "/";
}

/**
 * 剥离语言前缀，得到不含语言段的逻辑路径。
 */
export function stripLocalePrefix(
	pathname: string,
	locales: readonly string[],
): string {
	const normalized = normalizeCrawlPath(pathname);
	if (normalized === "/") return "/";
	const segments = normalized.split("/");
	const candidate = (segments[1] ?? "").toLowerCase();
	const isLocale = locales.some(
		(locale) => locale.trim().toLowerCase() === candidate,
	);
	if (!isLocale) return normalized;
	const rest = segments.slice(2).join("/");
	return rest ? `/${rest}` : "/";
}

/**
 * 按路径段边界做前缀匹配。
 */
export function matchesCrawlPrefix(path: string, prefix: string): boolean {
	if (prefix === "/") return true;
	return path === prefix || path.startsWith(`${prefix}/`);
}

/**
 * 判断某路径是否命中任一 noindex 规则。
 */
export function shouldNoindexPath(
	rules: readonly CrawlRule[],
	pathname: string,
	locales: readonly string[],
): boolean {
	const logicalPath = stripLocalePrefix(pathname, locales);
	return rules.some((rule) =>
		matchesCrawlPrefix(logicalPath, normalizeCrawlPath(rule.path)),
	);
}

/**
 * 判断给定路径是否匹配某条 CrawlRule。
 */
export function matchesCrawlRule(
	pathname: string,
	rule: CrawlRule,
): boolean {
	const { path, exact } = rule;

	if (exact) {
		return pathname === path;
	}

	if (pathname === path) return true;
	if (pathname.startsWith(path)) {
		const nextChar = pathname[path.length];
		return nextChar === "/";
	}
	return false;
}
