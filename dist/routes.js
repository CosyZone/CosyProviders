/**
 * Routes Provider：路由契约。
 *
 * 宿主聚合各插件的路由扩展，构建期生成路由包装。
 * 取 kuaiyizhi-web 超集接口（支持动态 addRoutes、kind、getStaticPaths）。
 */
import { defineProviderToken, } from "@coffic/cosy-kernel";
export const RouteProvidingToken = defineProviderToken("site.routes");
//# sourceMappingURL=routes.js.map