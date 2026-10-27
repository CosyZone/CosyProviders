/**
 * Layout Provider：布局契约。
 *
 * 宿主聚合各插件注入的视图，布局渲染层按区域输出。
 * 取 kuaiyizhi-web 超集接口（支持 region-based view injection）。
 */
import {
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";

/**
 * 布局注入点：根布局（AppLayout）中可被插件注入视图的区域。
 *
 * 对齐 Lumi `RootViewProviding` 的多视图 slot 模型：宿主组合各区域，
 * 插件在生命周期内向区域注册视图，布局渲染层按区域输出。
 */
export type LayoutRegion =
	| "header"
	| "sidebar"
	| "footer"
	| "overlay"
	| "banner"
	| "article-bottom";

/** 可被页面按 id 解析的完整页面布局。 */
export interface LayoutDefinition {
	/** 布局唯一 id，例如 app、course、textbook。 */
	readonly id: string;
	/** Astro 布局组件。Provider 契约不绑定具体组件实现类型。 */
	readonly component: unknown;
	/** 同 id 布局冲突时的排序依据（数值越小越优先）。 */
	readonly order?: number;
}

/** 注入到某区域的视图：组件引用 + 排序（默认 200，升序渲染）。 */
export interface LayoutView {
	/** 视图唯一 id（通常为插件包名）。 */
	readonly id: string;
	/** 视图组件引用（Astro 组件，渲染时由布局解析）。 */
	readonly component: (props: unknown) => unknown;
	readonly order?: number;
}

/** 布局契约提供方：宿主聚合各插件注入的视图，布局渲染层按区域输出。 */
export interface LayoutProviding {
	registerLayout(
		ownerPluginID: string,
		layout: LayoutDefinition,
	): ContributionHandle;
	getLayout(id: string): LayoutDefinition;
	hasLayout(id: string): boolean;
	layouts(): readonly LayoutDefinition[];
	register(
		ownerPluginID: string,
		region: LayoutRegion,
		view: LayoutView,
	): ContributionHandle;
	views(region: LayoutRegion): readonly LayoutView[];
}

export const LayoutProvidingToken = defineProviderToken<LayoutProviding>(
	"site.layout",
);
