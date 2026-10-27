/**
 * Header Provider：Header 契约。
 *
 * 宿主聚合各插件的 Header 扩展，渲染层按条目输出。
 * 取 kuaiyizhi-web 超集接口（支持 actions、pathname in context）。
 */
import { defineProviderToken, } from "@coffic/cosy-kernel";
export const HeaderProvidingToken = defineProviderToken("site.header");
//# sourceMappingURL=header.js.map