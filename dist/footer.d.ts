/**
 * Footer Provider：Footer 契约。
 *
 * 宿主聚合各插件的 Footer 扩展，渲染层按列输出。
 * 取 kuaiyizhi-web 超集接口（支持 widgets、item contributions、social links）。
 */
import { type ContributionHandle } from "@coffic/cosy-kernel";
import type { LocalizedText } from "./types.js";
/** Footer 渲染上下文：语言、链接解析器、社交链接。 */
export interface FooterContext {
    readonly lang: string;
    readonly link: (path: string) => string;
    readonly socialLinks?: Readonly<Record<string, string>>;
}
/** Footer 中的单个链接项。 */
export interface FooterItem {
    readonly id: string;
    readonly title: LocalizedText | ((context: FooterContext) => string);
    readonly href: string | ((context: FooterContext) => string);
    readonly target?: string;
    readonly rel?: string;
}
/** Footer 中的一列（含列标题与链接项）。 */
export interface FooterColumn {
    readonly id: string;
    readonly title: LocalizedText | ((context: FooterContext) => string);
    readonly items: readonly FooterItem[];
    readonly order?: number;
}
/**
 * Footer 内的组件插槽位置。
 *
 * - `columns`：链接列区域下方，跨整行（趋势图等整宽次要信息）
 * - `bottom`：底部版权信息行内
 */
export type FooterWidgetSlot = "columns" | "bottom";
/**
 * 插件注入 Footer 内部的组件（区别于列/链接条目，这类内容不是链接）。
 *
 * 组件收到 props：{ lang, kernel }，与 Footer 视图本身一致。
 */
export interface FooterWidget {
    readonly id: string;
    readonly slot: FooterWidgetSlot;
    readonly component: (props: unknown) => unknown;
    readonly order?: number;
}
/** 往宿主预定义列追加的条目贡献。 */
export interface FooterItemContribution {
    readonly targetColumnId: string;
    readonly items: readonly FooterItem[];
    readonly order?: number;
}
/** 插件注入的 Footer 扩展：可贡献新列、条目，也可贡献 Footer 内部组件。 */
export interface FooterExtension {
    readonly id: string;
    readonly order?: number;
    readonly getColumns?: (context: FooterContext) => readonly FooterColumn[];
    readonly getContributions?: (context: FooterContext) => readonly FooterItemContribution[];
    readonly getWidgets?: (context: FooterContext) => readonly FooterWidget[];
}
/** Footer 契约提供方：宿主聚合各插件的 Footer 扩展，渲染层按列输出。 */
export interface FooterProviding {
    addExtension(ownerPluginID: string, extension: FooterExtension): ContributionHandle;
    columns(context: FooterContext): readonly FooterColumn[];
    /** 聚合需在 Footer DOM 内部渲染的组件（图表等非链接内容）。 */
    widgets(context: FooterContext): readonly FooterWidget[];
}
export declare const FooterProvidingToken: import("@coffic/cosy-kernel").ProviderToken<FooterProviding>;
//# sourceMappingURL=footer.d.ts.map