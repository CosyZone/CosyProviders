/**
 * Layout Provider — 布局契约 + 默认实现。
 */
import { type ContributionHandle } from "@coffic/cosy-kernel";
/**
 * 布局注入点：根布局（AppLayout）中可被插件注入视图的区域。
 */
export type LayoutRegion = "header" | "sidebar" | "footer" | "overlay" | "banner" | "article-bottom";
/** 可被页面按 id 解析的完整页面布局。 */
export interface LayoutDefinition {
    readonly id: string;
    readonly component: unknown;
    readonly order?: number;
}
/** 注入到某区域的视图。 */
export interface LayoutView {
    readonly id: string;
    readonly component: (props: unknown) => unknown;
    readonly order?: number;
}
/** 布局契约提供方。 */
export interface LayoutProviding {
    registerLayout(ownerPluginID: string, layout: LayoutDefinition): ContributionHandle;
    getLayout(id: string): LayoutDefinition;
    hasLayout(id: string): boolean;
    layouts(): readonly LayoutDefinition[];
    register(ownerPluginID: string, region: LayoutRegion, view: LayoutView): ContributionHandle;
    views(region: LayoutRegion): readonly LayoutView[];
}
export declare const LayoutProvidingToken: import("@coffic/cosy-kernel").ProviderToken<LayoutProviding>;
/**
 * 布局契约默认宿主实现：聚合各插件注入的具名布局与区域视图。
 *
 * 由组合根（factory 的 registerProviders）注册，而非某个业务插件。
 */
export declare class DefaultLayoutProvider implements LayoutProviding {
    private readonly layoutsByID;
    private readonly viewsByRegion;
    registerLayout(ownerPluginID: string, layout: LayoutDefinition): ContributionHandle;
    getLayout(id: string): LayoutDefinition;
    hasLayout(id: string): boolean;
    layouts(): readonly LayoutDefinition[];
    register(ownerPluginID: string, region: LayoutRegion, view: LayoutView): ContributionHandle;
    views(region: LayoutRegion): readonly LayoutView[];
}
//# sourceMappingURL=layout.d.ts.map