/**
 * Home Provider：首页模块契约。
 *
 * 宿主聚合各插件的首页模块，渲染层按顺序输出。
 * 两端接口已一致。
 */
import {
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";

/** 首页渲染上下文。 */
export interface HomeContext {
	readonly lang: string;
}

/** 首页模块：贡献一个首页区块（hero / cta / products / team 等）。 */
export interface HomeModule {
	readonly id: string;
	readonly order?: number;
	readonly component: unknown;
}

/** Home 契约提供方：宿主聚合各插件的首页模块，渲染层按顺序输出。 */
export interface HomeProviding {
	addModule(
		ownerPluginID: string,
		module: HomeModule,
	): ContributionHandle;
	modules(context: HomeContext): readonly HomeModule[];
}

export const HomeProvidingToken = defineProviderToken<HomeProviding>(
	"site.home",
);
