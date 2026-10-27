/**
 * Crawl Provider：爬虫索引策略契约。
 *
 * 聚合各插件声明的「不要索引」规则。
 * 语义边界：本契约只表达 **noindex**（不索引），不表达 Disallow（不抓取）。
 * 两端接口已高度一致。
 */
import {
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";

/**
 * 插件声明的「不要索引」规则。
 *
 * 规则以「逻辑路径前缀」表达，**不含语言段**：插件声明 `/about`，
 * 而不是 `/zh-cn/about`，语言前缀由提供方按当前语言目录展开。
 */
export interface CrawlRule {
	/**
	 * 逻辑路径，以 `/` 开头且不含语言段，例如 `/about`。
	 *
	 * 匹配语义由 `exact` 决定：默认是**路径段边界前缀**，`/about` 命中
	 * `/about` 与 `/about/team`，但不命中 `/aboutus`。
	 */
	readonly path: string;
	/** 声明原因，用于诊断与 robots.txt 注释输出。 */
	readonly reason?: string;
	/**
	 * 是否只匹配该路径本身（不包含子路径）。
	 *
	 * 用于「语言跳转存根」这类场景：`/about` 是存根，而 `/meta/about`
	 * 是真实内容页——此时必须 `exact: true` 做精确匹配。
	 */
	readonly exact?: boolean;
	/**
	 * 规则作用范围，默认 `"localized"`。
	 *
	 * - `"localized"`：匹配前剥离语言前缀，一条规则覆盖全部语言版本
	 *   （`/about` 同时命中 `/about`、`/zh-cn/about`、`/en/about`）。
	 * - `"bare"`：**不剥离语言前缀**，只匹配不带语言段的那条路径。
	 *
	 * 后者的必要性：存在「裸路径是语言跳转存根、语言前缀路径才是真实页面」
	 * 的情况——`/products` 是 302 存根，而 `/en/products`、`/zh-cn/products`
	 * 是真实产品目录页。若按 `"localized"` 匹配，剥掉 `/en` 后两者都是
	 * `/products`，会把真实页面一并排除出 sitemap。
	 */
	readonly scope?: "localized" | "bare";
}

/**
 * 爬虫索引策略契约提供方：聚合各插件声明的「不要索引」规则。
 *
 * 运行时规则由装配层从插件入口的顶层 `crawl` 声明自动注入，
 * 插件通常无需手动调用本方法。
 */
export interface CrawlPolicyProviding {
	/**
	 * 声明一条「不要索引」规则。
	 *
	 * @param ownerPluginID - 声明该规则的插件；规则随插件作用域自动撤销。
	 * @param rule - 逻辑路径前缀（不含语言段），见 CrawlRule。
	 */
	exclude(ownerPluginID: string, rule: CrawlRule): ContributionHandle;

	/** 全部已声明的规则（按声明顺序）。 */
	rules(): readonly CrawlRule[];

	/**
	 * 判断某个请求路径是否不应被索引。
	 *
	 * @param pathname - 请求的 URL 路径（含语言段，如 `/zh-cn/about`）。
	 * @param locales - 当前语言目录，用于剥离语言前缀后再匹配规则。
	 */
	shouldNoindex(pathname: string, locales: readonly string[]): boolean;
}

export const CrawlPolicyProvidingToken = defineProviderToken<CrawlPolicyProviding>(
	"site.crawl",
);

/**
 * 判断给定路径是否匹配某条 CrawlRule。
 *
 * 匹配语义：
 * - 默认（exact !== true）：路径段边界前缀匹配
 * - exact === true：精确匹配
 */
export function matchesCrawlRule(
	pathname: string,
	rule: CrawlRule,
): boolean {
	const { path, exact } = rule;

	if (exact) {
		return pathname === path;
	}

	// 路径段边界前缀匹配
	if (pathname === path) return true;
	if (pathname.startsWith(path)) {
		const nextChar = pathname[path.length];
		return nextChar === "/";
	}
	return false;
}

/**
 * 从路径中剥离语言前缀。
 *
 * 例如 `/zh-cn/about` → `/about`（当 locales 包含 `zh-cn` 时）。
 */
export function stripLocalePrefix(
	pathname: string,
	locales: readonly string[],
): string {
	for (const locale of locales) {
		const prefix = `/${locale}`;
		if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
			return pathname.slice(prefix.length) || "/";
		}
	}
	return pathname;
}
