/**
 * Layout Provider — 布局契约 + 默认实现。
 */
import {
	createContribution,
	defineProviderToken,
	type ContributionHandle,
} from "@coffic/cosy-kernel";

/**
 * 布局注入点：根布局（AppLayout）中可被插件注入视图的区域。
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

const DEFAULT_ORDER = 200;

/**
 * 布局契约默认宿主实现：聚合各插件注入的具名布局与区域视图。
 *
 * 由组合根（factory 的 registerProviders）注册，而非某个业务插件。
 */
export class DefaultLayoutProvider implements LayoutProviding {
	private readonly layoutsByID = new Map<string, LayoutDefinition>();
	private readonly viewsByRegion = new Map<LayoutRegion, LayoutView[]>();

	registerLayout(
		ownerPluginID: string,
		layout: LayoutDefinition,
	): ContributionHandle {
		if (this.layoutsByID.has(layout.id)) {
			throw new Error(`Duplicate layout '${layout.id}'`);
		}
		this.layoutsByID.set(layout.id, {
			id: layout.id,
			component: layout.component,
			order: layout.order ?? DEFAULT_ORDER,
		});
		return createContribution(ownerPluginID, () => {
			if (this.layoutsByID.get(layout.id)?.component !== layout.component) {
				return;
			}
			this.layoutsByID.delete(layout.id);
		});
	}

	getLayout(id: string): LayoutDefinition {
		const layout = this.layoutsByID.get(id);
		if (!layout) {
			throw new Error(`Layout '${id}' is not registered`);
		}
		return layout;
	}

	hasLayout(id: string): boolean {
		return this.layoutsByID.has(id);
	}

	layouts(): readonly LayoutDefinition[] {
		return [...this.layoutsByID.values()].sort(
			(left, right) =>
				(left.order ?? DEFAULT_ORDER) - (right.order ?? DEFAULT_ORDER),
		);
	}

	register(
		ownerPluginID: string,
		region: LayoutRegion,
		view: LayoutView,
	): ContributionHandle {
		const views = this.viewsByRegion.get(region) ?? [];
		if (views.some((existing) => existing.id === view.id)) {
			throw new Error(`Duplicate layout view '${view.id}' in '${region}'`);
		}
		views.push({
			id: view.id,
			component: view.component,
			order: view.order ?? DEFAULT_ORDER,
		});
		this.viewsByRegion.set(region, views);
		return createContribution(ownerPluginID, () => {
			const current = this.viewsByRegion.get(region);
			if (!current) return;
			const remaining = current.filter(
				(existing) => existing.id !== view.id,
			);
			if (remaining.length === 0) {
				this.viewsByRegion.delete(region);
			} else {
				this.viewsByRegion.set(region, remaining);
			}
		});
	}

	views(region: LayoutRegion): readonly LayoutView[] {
		return (this.viewsByRegion.get(region) ?? [])
			.slice()
			.sort(
				(a, b) =>
					(a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER),
			);
	}
}
