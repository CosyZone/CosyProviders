/**
 * Header Provider：Header 契约。
 *
 * 宿主聚合各插件的 Header 扩展，渲染层按条目输出。
 * 取 kuaiyizhi-web 超集接口（支持 actions、pathname in context）。
 */
import {
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";

/** Header 渲染上下文。 */
export interface HeaderContext {
	readonly lang: string;
	readonly pathname: string;
	readonly link: (path: string) => string;
}

/** 单个导航项。 */
export interface HeaderItem {
	readonly id: string;
	readonly href: string | ((context: HeaderContext) => string);
	readonly order?: number;
}

/** Header 动作按钮：由插件在页面上下文中动态注册。 */
export interface HeaderAction {
	readonly id: string;
	/** href 型动作的跳转地址；与 component 互斥，提供 component 时优先渲染组件。 */
	readonly href?: string;
	readonly label: string;
	/** 仅显示图标，label 仍作为无障碍名称和悬浮提示使用。 */
	readonly iconOnly?: boolean;
	/**
	 * 组件型动作：插件把完整交互控件注入 Header。
	 * 组件收到 props：{ id, label, lang, pathname, link }。
	 * 与 href 互斥，提供 component 时优先渲染组件。
	 */
	readonly component?: (props: Record<string, unknown>) => unknown;
}

/** 插件贡献的导航扩展。 */
export interface HeaderExtension {
	readonly id: string;
	readonly order?: number;
	readonly getItems: (context: HeaderContext) => readonly HeaderItem[];
	/** 返回当前页面上下文中需要出现在 Header 右侧的动作按钮；无则返回空数组。 */
	readonly getActions?: (context: HeaderContext) => Promise<readonly HeaderAction[]>;
}

/** Header 契约提供方：宿主聚合各插件的 Header 扩展，渲染层按条目输出。 */
export interface HeaderProviding {
	addExtension(
		ownerPluginID: string,
		extension: HeaderExtension,
	): ContributionHandle;
	items(context: HeaderContext): readonly HeaderItem[];
	actions(context: HeaderContext): Promise<readonly HeaderAction[]>;
}

export const HeaderProvidingToken = defineProviderToken<HeaderProviding>(
	"site.header",
);
