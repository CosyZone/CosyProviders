/**
 * Routes Provider：路由契约。
 *
 * 宿主聚合各插件的路由扩展，构建期生成路由包装。
 * 取 kuaiyizhi-web 超集接口（支持动态 addRoutes、kind、getStaticPaths）。
 */
import { type ContributionHandle } from "@coffic/cosy-kernel";
/** 插件/产品包声明的页面路由（与生成器契约一致）。 */
export interface FeatureRoute {
    readonly id: string;
    readonly pattern: string;
    readonly kind?: "page" | "api";
    /** 包子路径（兼容旧插件）或相对于插件 src/index.ts 的内部模块路径。 */
    readonly component?: string;
    readonly prerender?: boolean;
    /** 包子路径（兼容旧插件）或相对于插件 src/index.ts 的内部模块路径。 */
    readonly getStaticPaths?: string;
    /** 站点级 redirect（与 component 互斥，二选一）。 */
    readonly redirect?: string;
}
/** Routes 契约提供方：宿主聚合各插件的路由扩展，构建期生成路由包装。 */
export interface RouteProviding {
    addRoutes(ownerPluginID: string, routes: readonly FeatureRoute[]): ContributionHandle;
    routes(): readonly FeatureRoute[];
}
export declare const RouteProvidingToken: import("@coffic/cosy-kernel").ProviderToken<RouteProviding>;
//# sourceMappingURL=routes.d.ts.map